import React, { useState } from 'react';
import { useStore, CURRENCY_SYMBOLS } from '../context/StoreContext';
import { getLocalizedProduct } from '../utils/translations';
import { 
  X, 
  Check, 
  Copy, 
  ShoppingBag, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  Star, 
  ArrowRight,
  Sparkles,
  Database,
  Bot,
  TrendingUp,
  Layers,
  Code2,
  CheckCircle2,
  Lock,
  Package,
  Download
} from 'lucide-react';

const iconMap = {
  Database,
  Bot,
  TrendingUp,
  Terminal,
  Layers
};

export const ProductModal = () => {
  const { selectedProduct, setSelectedProduct, addToCart, currency, getProductPrice, addToast, t, language } = useStore();
  const [selectedLicenseIndex, setSelectedLicenseIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!selectedProduct) return null;

  const prod = getLocalizedProduct(selectedProduct, language);
  const Icon = iconMap[prod.icon] || Layers;
  const licensesList = Array.isArray(prod.licenses) && prod.licenses.length > 0
    ? prod.licenses
    : [
        { type: language === 'EN' ? 'Standard License' : 'Standart Lisans', priceMultiplier: 1, desc: language === 'EN' ? '1 Server / Device deployment.' : '1 Cihaz / Sunucu için hazır kullanım.' },
        { type: language === 'EN' ? 'Commercial License' : 'Ticari Lisans', priceMultiplier: 2.2, desc: language === 'EN' ? 'Unlimited server installations.' : 'Sınırsız sunucu kurulumu ve ticari kullanım.' },
        { type: language === 'EN' ? 'Full Source Code' : 'Tam Kaynak Kod (Full Source)', priceMultiplier: 3.8, desc: language === 'EN' ? 'All source code, scripts, and docs.' : 'Bütün açık kaynak kodlar ve dökümantasyon.' }
      ];
  const selectedLicense = licensesList[selectedLicenseIndex] || licensesList[0];
  const finalPrice = getProductPrice(prod, selectedLicense, currency);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(prod.snippet);
    setCopiedCode(true);
    addToast(language === 'EN' ? 'Code snippet copied to clipboard!' : 'Kod parçacığı panoya kopyalandı!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddToCart = () => {
    addToCart(prod, selectedLicense);
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-slate-950/20 text-slate-900 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header Bar */}
        <div className="sticky top-0 z-20 px-6 sm:px-8 py-5 bg-white/95 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0 border border-indigo-100">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  {prod.title}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-indigo-50 text-indigo-700">
                  {prod.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{prod.subtitle}</p>
            </div>
          </div>

          <button
            onClick={() => setSelectedProduct(null)}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title={t('modal.close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: 2-Column Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Description, Features, Package Delivery & Code (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                {t('modal.overview')}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {prod.description}
              </p>
            </div>

            {/* Feature Checklist */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">
                {t('modal.specs')}
              </h4>
              <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {prod.specs.map((spec, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's In The Package (Instant Delivery) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 font-mono">
                <Package className="w-3.5 h-3.5 text-indigo-600" />
                <span>{language === 'EN' ? 'Package Delivery Contents (Instant Download)' : 'Paket Teslimat İçeriği (Anında İndirme)'}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/70">
                <div className="flex items-center gap-2 text-slate-800">
                  <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>{language === 'EN' ? 'Full Source Code Archive (.ZIP)' : 'Tam Kaynak Kod Dosyaları (.ZIP)'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800">
                  <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>{language === 'EN' ? 'Docker & Environment Config' : 'Docker & Ortam Yapılandırması'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800">
                  <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>{language === 'EN' ? 'Comprehensive Setup Manual' : 'Detaylı Kurulum Kılavuzu'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800">
                  <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>{language === 'EN' ? '6 Months VIP Dev Support' : '6 Ay VIP Geliştirici Desteği'}</span>
                </div>
              </div>
            </div>

            {/* Live Code Snippet Preview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
                  <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{t('modal.codeSnippet')}</span>
                </h4>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">{t('modal.copied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t('modal.copyCode')}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-2xl bg-slate-950 p-4 font-mono text-xs text-cyan-300 border border-slate-800 shadow-inner overflow-x-auto">
                <pre className="text-[11px] leading-relaxed">
                  <code>{prod.snippet}</code>
                </pre>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              {prod.techStack.map((tech, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-mono text-slate-700 font-semibold border border-slate-200/80">
                  {tech}
                </span>
              ))}
            </div>

          </div>

          {/* Right Column: Tiered Licensing & Checkout (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 lg:border-l lg:border-slate-100 lg:pl-8">
            
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                {t('modal.licenseSelection')}
              </h4>

              {/* License Tiers */}
              <div className="space-y-3">
                {licensesList.map((lic, index) => {
                  const isSelected = selectedLicenseIndex === index;
                  const tierPrice = getProductPrice(selectedProduct, lic, currency);

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedLicenseIndex(index)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-500 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-extrabold text-slate-900">
                            {lic.type}
                          </span>
                        </div>

                        <span className="text-xs font-extrabold font-mono text-slate-900">
                          {CURRENCY_SYMBOLS[currency]}{tierPrice.toLocaleString('tr-TR')}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                        {lic.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Final Pricing & CTA */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">
                    {language === 'EN' ? 'Total to Pay:' : 'Seçilen Toplam:'}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 font-mono">
                    {t('modal.oneTimePayment')}
                  </span>
                </div>
                <span className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                  {CURRENCY_SYMBOLS[currency]}{finalPrice.toLocaleString('tr-TR')}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-slate-900/10 hover:shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('modal.addToCart')}</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium pt-1">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {language === 'EN' ? 'Full Source Code' : '%100 Açık Kaynak'}</span>
                <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-indigo-600" /> {language === 'EN' ? 'Instant Delivery' : 'Anında Teslimat'}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
