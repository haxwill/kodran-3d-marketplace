import React from 'react';
import { 
  Download, 
  Terminal, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  KeyRound, 
  ShieldCheck 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WorkflowSteps = () => {
  const { setIsCustomOrderOpen, t, language } = useStore();

  const steps = [
    {
      step: '01',
      title: t('workflow.step1Title'),
      desc: t('workflow.step1Desc'),
      icon: Download,
      badge: language === 'EN' ? 'Instant Delivery' : 'Anında Teslimat'
    },
    {
      step: '02',
      title: t('workflow.step2Title'),
      desc: t('workflow.step2Desc'),
      icon: Terminal,
      badge: language === 'EN' ? 'Docker Ready' : 'Kolay Kurulum'
    },
    {
      step: '03',
      title: t('workflow.step3Title'),
      desc: t('workflow.step3Desc'),
      icon: TrendingUp,
      badge: '%99.99 Uptime'
    }
  ];

  return (
    <section className="py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-2 font-mono">
            {t('workflow.tag')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('workflow.title')}
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-normal">
            {t('workflow.subtitle')}
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, i) => {
            const Icon = item.icon;
            return (
              <div 
                key={i} 
                className="relative rounded-3xl bg-slate-50/70 border border-slate-200/90 p-8 flex flex-col justify-between hover:bg-white hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group"
              >
                <div>
                  {/* Step Number & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="text-3xl font-extrabold font-mono text-slate-300 group-hover:text-indigo-600 transition-colors">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-bold font-mono px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
                      {item.badge}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 mb-5 shadow-xs group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/80 flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'EN' ? 'Documentation & Support Included' : 'Dökümantasyon & Destek Dahil'}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
