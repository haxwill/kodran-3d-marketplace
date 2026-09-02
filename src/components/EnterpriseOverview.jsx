import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Server, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Globe, 
  Lock, 
  Activity, 
  CheckCircle2,
  Code2
} from 'lucide-react';

export const EnterpriseOverview = () => {
  const { t, language } = useStore();

  const features = [
    {
      icon: Cpu,
      title: t('enterprise.pillar1Title'),
      desc: t('enterprise.pillar1Desc'),
      badge: language === 'EN' ? 'High Performance' : 'Yüksek Performans'
    },
    {
      icon: ShieldCheck,
      title: t('enterprise.pillar2Title'),
      desc: t('enterprise.pillar2Desc'),
      badge: '%100 Uptime'
    },
    {
      icon: Lock,
      title: t('enterprise.pillar3Title'),
      desc: t('enterprise.pillar3Desc'),
      badge: language === 'EN' ? 'Full Ownership' : 'Tam Mülkiyet'
    },
    {
      icon: Globe,
      title: t('enterprise.pillar4Title'),
      desc: t('enterprise.pillar4Desc'),
      badge: language === 'EN' ? '24/7 Support' : '7/24 Destek'
    },
  ];

  return (
    <section id="enterprise" className="py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-2 font-mono">
            {t('enterprise.tag')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('enterprise.title')}
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            {t('enterprise.subtitle')}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="enterprise-card rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wide block mb-1">
                    {f.badge}
                  </span>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {f.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'EN' ? 'Verified Architecture' : 'Doğrulanmış Mimari'}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
