import React, { useState, useMemo } from 'react';
import { useStore, CURRENCY_SYMBOLS } from '../context/StoreContext';
import { 
  Calculator as CalcIcon, 
  Check, 
  Clock, 
  Send, 
  ShieldCheck, 
  Database, 
  Bot, 
  Layers, 
  TrendingUp, 
  Terminal 
} from 'lucide-react';

export const Calculator = () => {
  const { currency, setIsCustomOrderOpen } = useStore();

  const projectTypes = [
    { id: 'scraping', name: 'Veri Kazıma (Scraper)', basePriceTRY: 2500, days: 3, icon: Database },
    { id: 'bot', name: 'Telegram / WA Botu', basePriceTRY: 3500, days: 4, icon: Bot },
    { id: 'saas', name: 'Özel Web & SaaS Sistemi', basePriceTRY: 6000, days: 7, icon: Layers },
    { id: 'crypto', name: 'Finans & Arbitraj Botu', basePriceTRY: 5500, days: 6, icon: TrendingUp },
    { id: 'desktop', name: 'Masaüstü & CLI Aracı', basePriceTRY: 3000, days: 4, icon: Terminal },
  ];

  const [selectedType, setSelectedType] = useState('scraping');
  const [complexity, setComplexity] = useState(2); // 1 to 4
  const [selectedAddons, setSelectedAddons] = useState(['anti_detect', 'dashboard']);

  const addonsList = [
    { id: 'anti_detect', name: 'Anti-Bot & Cloudflare Bypass', priceTRY: 1200, addDays: 1 },
    { id: 'dashboard', name: 'Özel Web Yönetim Paneli', priceTRY: 1800, addDays: 2 },
    { id: 'notifications', name: 'Telegram / Discord Anlık Bildirim', priceTRY: 600, addDays: 0 },
    { id: 'multi_threading', name: 'Yüksek Hızlı Eşzamanlı Thread (1000+)', priceTRY: 1400, addDays: 1 },
    { id: 'source_code', name: 'Eksiksiz Açık Kaynak Kod & Mimari', priceTRY: 2200, addDays: 0 },
  ];

  const toggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const calculatedResult = useMemo(() => {
    const currentProj = projectTypes.find((p) => p.id === selectedType) || projectTypes[0];
    const complexityMultiplier = 0.8 + complexity * 0.35;
    const base = currentProj.basePriceTRY * complexityMultiplier;

    const addonsTotal = selectedAddons.reduce((sum, addId) => {
      const add = addonsList.find((a) => a.id === addId);
      return sum + (add ? add.priceTRY : 0);
    }, 0);

    const totalTRY = Math.round(base + addonsTotal);

    let finalPrice = totalTRY;
    if (currency === 'USD') finalPrice = Math.round(totalTRY / 33);
    if (currency === 'EUR') finalPrice = Math.round(totalTRY / 36);

    const extraDays = selectedAddons.reduce((sum, addId) => {
      const add = addonsList.find((a) => a.id === addId);
      return sum + (add ? add.addDays : 0);
    }, 0);
    const totalDays = Math.round(currentProj.days * (0.8 + complexity * 0.25) + extraDays);

    return {
      price: finalPrice,
      days: totalDays,
      projectTitle: currentProj.name,
    };
  }, [selectedType, complexity, selectedAddons, currency]);

  return (
    <section id="calculator" className="py-20 bg-slate-50/60 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-2">
            Şeffaf Fiyatlandırma
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Özel Yazılım & Bot Fiyat Hesaplayıcı
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            İhtiyacınız olan özellikleri belirleyin, tahmini proje bütçesini ve teslim süresini anında görün.
          </p>
        </div>

        {/* Calculator Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Configuration (8 cols) */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-8">
            
            {/* Step 1: Category */}
            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-3">
                1. Proje Türünü Seçin
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {projectTypes.map((proj) => {
                  const Icon = proj.icon;
                  const isSelected = selectedType === proj.id;
                  return (
                    <button
                      key={proj.id}
                      onClick={() => setSelectedType(proj.id)}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                        {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <span className="text-xs font-bold text-slate-900">{proj.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Complexity Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. İşlem / Veri Hacmi Kapsamı
                </label>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  {complexity === 1 && 'Temel Düzey'}
                  {complexity === 2 && 'Standart Düzey'}
                  {complexity === 3 && 'İleri Düzey'}
                  {complexity === 4 && 'Kurumsal & Kesintisiz 7/24'}
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={complexity}
                onChange={(e) => setComplexity(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Step 3: Addons */}
            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-3">
                3. Ek Özellikler & Modüller
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {addonsList.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        isChecked
                          ? 'border-indigo-500 bg-indigo-50/40 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium text-slate-800">{addon.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Estimate Summary (4 cols) */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 pb-3 border-b border-slate-100">
              Tahmini Proje Özeti
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Kategori:</span>
                <strong className="text-slate-900">{calculatedResult.projectTitle}</strong>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Ek Özellikler:</span>
                <strong className="text-indigo-600">{selectedAddons.length} Modül Seçildi</strong>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Tahmini Teslim: <strong>{calculatedResult.days} - {calculatedResult.days + 2} İş Günü</strong></span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Tahmini Fiyat:</span>
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {CURRENCY_SYMBOLS[currency]}{calculatedResult.price.toLocaleString('tr-TR')}
                </span>
              </div>

              <button
                onClick={() => setIsCustomOrderOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Bu Proje İçin Teklif İste</span>
              </button>

              <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Kaynak Kod & %100 Memnuniyet Garantisi
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
