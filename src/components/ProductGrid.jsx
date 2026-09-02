import React, { useMemo } from 'react';
import { useStore, CURRENCY_SYMBOLS } from '../context/StoreContext';
import { getLocalizedProduct, getLocalizedCategoryName } from '../utils/translations';
import { ProductGrid3DBackground } from './ProductGrid3DBackground';
import { 
  ShoppingBag, 
  Search, 
  Check, 
  Database, 
  Bot, 
  TrendingUp, 
  Terminal, 
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  Download,
  Flame
} from 'lucide-react';

const iconMap = {
  Database,
  Bot,
  TrendingUp,
  Terminal,
  Layers
};

export const ProductGrid = () => {
  const { 
    productsList, 
    categoriesList = [],
    activeFilter, 
    setActiveFilter, 
    searchQuery, 
    setSearchQuery, 
    currency, 
    getProductPrice, 
    addToCart, 
    setSelectedProduct,
    setIsCartOpen,
    t,
    language 
  } = useStore();

  const localizedProducts = useMemo(() => {
    return productsList.map((p) => getLocalizedProduct(p, language));
  }, [productsList, language]);

  const filteredProducts = useMemo(() => {
    return localizedProducts.filter((product) => {
      if (activeFilter !== 'all' && product.category !== activeFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          product.title.toLowerCase().includes(q) ||
          product.subtitle.toLowerCase().includes(q) ||
          (Array.isArray(product.techStack) && product.techStack.some((t) => typeof t === 'string' && t.toLowerCase().includes(q)))
        );
      }
      return true;
    });
  }, [localizedProducts, activeFilter, searchQuery]);

  const handleInstantBuy = (product) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <section id="products" className="relative py-24 bg-slate-50/40 border-b border-slate-200/80 overflow-hidden">
      
      {/* 3D Interactive Cyber Lattice Background */}
      <ProductGrid3DBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-2 font-mono">
              {t('catalog.tag')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t('catalog.title')}
            </h2>
            <p className="text-slate-500 text-sm mt-1.5 max-w-xl font-normal">
              {t('catalog.subtitle')}
            </p>
          </div>

          {/* Real-time Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('catalog.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 shadow-2xs transition-all"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 pb-8 overflow-x-auto no-scrollbar">
          {[{ id: 'all', name: t('catalog.all') }, ...categoriesList].map((cat) => {
            const isActive = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white/90 backdrop-blur-sm text-slate-600 hover:bg-white hover:text-slate-900 border border-slate-200'
                }`}
              >
                {getLocalizedCategoryName(cat, language)}
              </button>
            );
          })}
        </div>

        {/* 3-Column Equal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const Icon = iconMap[product.icon] || Layers;
            const price = getProductPrice(product);

            return (
              <div
                key={product.id}
                className="group relative rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 hover:border-indigo-400 p-7 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                <div>
                  {/* Top Bar: Icon + Badge + Verified */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0 border border-indigo-100/80 shadow-2xs group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono bg-slate-100 text-slate-700">
                        {product.badge}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium font-mono">
                        <span className="text-emerald-600 font-bold">%{Math.round(product.rating * 20)}</span>
                        <span>({product.salesCount} {language === 'EN' ? 'Deploys' : 'Dağıtım'})</span>
                      </div>
                    </div>
                  </div>

                  {/* Social Proof Live Badge */}
                  {product.salesBadge && (
                    <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/60 text-[11px] font-bold text-amber-800">
                      <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                      <span>{product.salesBadge}</span>
                    </div>
                  )}

                  {/* Title & Subtitle */}
                  <h3 
                    onClick={() => setSelectedProduct(product)}
                    className="text-lg font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors line-clamp-1 mb-1.5"
                  >
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {product.subtitle}
                  </p>

                  {/* ROI / Value Summary */}
                  {product.roiText && typeof product.roiText === 'string' && (
                    <div className="mb-4 p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100/80 text-[11px] font-semibold text-indigo-950 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="line-clamp-1">{product.roiText}</span>
                    </div>
                  )}

                  {/* 3 Crisp Key Features */}
                  <div className="space-y-2 mb-6 text-xs text-slate-600 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                    {(Array.isArray(product.specs) ? product.specs.slice(0, 3) : []).map((spec, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1 font-medium">{typeof spec === 'object' ? (spec.TR || spec.EN || '') : spec}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {(Array.isArray(product.techStack) ? product.techStack : []).map((tech, i) => (
                      <span 
                        key={i} 
                        className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-[11px] font-mono text-slate-700 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                </div>

                {/* Bottom Row: Price & Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 block font-mono">
                      {t('catalog.oneTimePayment')}
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 font-mono tracking-tight">
                      {CURRENCY_SYMBOLS[currency]}{price.toLocaleString('tr-TR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {t('catalog.details')}
                    </button>

                    <button
                      onClick={() => handleInstantBuy(product)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-xs hover:shadow-indigo-600/20 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t('catalog.buyNow')}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Trust Guarantee Strip */}
        <div className="mt-14 p-5 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-around gap-4 text-xs text-slate-600 font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-indigo-600" />
            <span>{t('catalog.licenseIncluded')}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t('catalog.fastDelivery')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-600" />
            <span>256-Bit SSL Encrypted & Protected</span>
          </div>
        </div>

      </div>
    </section>
  );
};
