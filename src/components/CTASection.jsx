import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Bot } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CTASection = () => {
  const { setIsCustomOrderOpen, t, language } = useStore();

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Luxury Pure White & Soft Radiance Card */}
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white text-slate-900 p-10 sm:p-16 overflow-hidden border border-slate-200/90 shadow-xl shadow-slate-200/50">
          
          {/* Ambient Soft Glows */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-b from-indigo-100/60 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-gradient-to-t from-cyan-100/50 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-indigo-700 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t('cta.badge')}</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              {t('cta.title')}
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed font-normal">
              {t('cta.subtitle')}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
              <a
                href="#products"
                className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-md shadow-slate-900/10 hover:shadow-indigo-600/25 transition-all duration-200 inline-flex items-center gap-2"
              >
                <span>{t('cta.exploreBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => setIsCustomOrderOpen(true)}
                className="px-7 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 shadow-2xs hover:border-slate-400 transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
              >
                <Bot className="w-4 h-4 text-indigo-600" />
                <span>{t('cta.customOrderBtn')}</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-slate-600 font-semibold">
              <span className="flex items-center gap-1.5 text-slate-700"><ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" /> {t('cta.badge1')}</span>
              <span className="flex items-center gap-1.5 text-slate-700"><Zap className="w-4 h-4 text-indigo-600 stroke-[2.5]" /> {t('cta.badge2')}</span>
              <span className="flex items-center gap-1.5 text-slate-700"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {t('cta.badge3')}</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
