import React, { useState, useMemo } from 'react';
import { products, categories } from '../data/products';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  SlidersHorizontal, 
  Layers, 
  Bot, 
  DatabaseZap, 
  Sparkles, 
  Globe, 
  Terminal,
  XCircle,
  PackageOpen,
  Radio
} from 'lucide-react';
import { soundFX } from '../utils/audio';

const categoryIconMap = {
  Layers,
  Bot,
  DatabaseZap,
  Sparkles,
  Globe,
  Terminal,
};

export const ProductCatalog = () => {
  const { 
    productsList,
    activeFilter, 
    setActiveFilter, 
    searchQuery, 
    setSearchQuery,
    currency,
    getProductPrice
  } = useStore();

  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'price-low', 'price-high', 'rating'

  const filteredProducts = useMemo(() => {
    return productsList
      .filter((product) => {
        // Category filter
        if (activeFilter !== 'all' && product.category !== activeFilter) {
          return false;
        }
        // Search query filter
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchTitle = product.title.toLowerCase().includes(q);
          const matchSubtitle = product.subtitle.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchTech = product.techStack.some((t) => t.toLowerCase().includes(q));
          return matchTitle || matchSubtitle || matchDesc || matchTech;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.salesCount - a.salesCount;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price-low') {
          return getProductPrice(a) - getProductPrice(b);
        }
        if (sortBy === 'price-high') {
          return getProductPrice(b) - getProductPrice(a);
        }
        return 0;
      });
  }, [activeFilter, searchQuery, sortBy, currency, getProductPrice]);

  return (
    <section id="products" className="py-24 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-bold border border-indigo-200/60 mb-3">
              <Radio className="w-3.5 h-3.5 text-indigo-600" />
              OTONOM YAZILIM VİTRİNİ
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Gelişmiş Yazılım ve Bot Kataloğu
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl">
              Anında kuruluma hazır, test edilmiş, yüksek performanslı otomasyon araçları ve açık kaynak kodlu SaaS şablonları.
            </p>
          </div>

          {/* Quick Search & Sort Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Yazılım veya teknoloji ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  soundFX.playClick();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 shadow-sm cursor-pointer"
              >
                <option value="popular">🔥 En Popüler</option>
                <option value="rating">⭐ En Yüksek Puan</option>
                <option value="price-low">📉 Fiyat: Düşükten Yükseğe</option>
                <option value="price-high">📈 Fiyat: Yüksekten Düşüğe</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => {
            const Icon = categoryIconMap[cat.icon] || Layers;
            const isActive = activeFilter === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveFilter(cat.id);
                  soundFX.playClick();
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15 scale-[1.02]'
                    : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{cat.name}</span>
                {cat.id === 'all' && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {products.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="w-full py-16 px-4 rounded-3xl glass-panel text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Eşleşen Yazılım Bulunamadı</h3>
            <p className="text-sm text-slate-500 max-w-md mb-6">
              Aradığınız kriterlere uygun bir hazır yazılım bulunamadı. Dilerseniz aramanızı sıfırlayabilir veya özel geliştirme talebinde bulunabilirsiniz.
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
                soundFX.playClick();
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-md"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
