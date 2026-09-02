import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FAQ = () => {
  const { setIsCustomOrderOpen, t, language } = useStore();
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: t('faq.q1'),
      a: t('faq.a1')
    },
    {
      q: t('faq.q2'),
      a: t('faq.a2')
    },
    {
      q: t('faq.q3'),
      a: t('faq.a3')
    },
    {
      q: t('faq.q4'),
      a: t('faq.a4')
    }
  ];

  return (
    <section className="py-24 bg-slate-50/60 border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-2 font-mono">
            {t('faq.tag')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('faq.title')}
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-normal">
            {t('faq.subtitle')}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen 
                    ? 'bg-white border-indigo-200 shadow-md shadow-indigo-950/5' 
                    : 'bg-white/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-base font-bold text-slate-900 leading-snug">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-indigo-50 text-indigo-600 rotate-180' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help Box */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-sm font-bold text-slate-900">
              {language === 'EN' ? 'Have more technical questions?' : 'Aklınıza takılan başka bir soru mu var?'}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'EN' ? 'Our engineering team will be glad to assist you.' : 'Mühendislik ekibimiz size yardımcı olmaktan mutluluk duyar.'}
            </p>
          </div>

          <button
            onClick={() => setIsCustomOrderOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            {language === 'EN' ? 'Contact Engineers' : 'Bize Ulaşın'}
          </button>
        </div>

      </div>
    </section>
  );
};
