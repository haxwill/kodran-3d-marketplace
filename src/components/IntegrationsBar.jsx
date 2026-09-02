import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Database, 
  Bot, 
  TrendingUp, 
  Terminal, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Radio,
  Server
} from 'lucide-react';

export const IntegrationsBar = () => {
  const { t, language } = useStore();

  const stacks = [
    { name: 'Python 3.12', role: language === 'EN' ? 'Scraping & Core' : 'Scraping & Çekirdek' },
    { name: 'Playwright Stealth', role: language === 'EN' ? 'Anti-Bot Engine' : 'Anti-Bot Motoru' },
    { name: 'OpenAI GPT-4o', role: language === 'EN' ? 'Vector AI & RAG' : 'Vektör AI & RAG' },
    { name: 'Rust Tokio', role: language === 'EN' ? '2.1ms Arbitrage' : '2.1ms Arbitraj' },
    { name: 'Docker & VPS', role: language === 'EN' ? 'Compose Ready' : 'Compose Hazır' },
    { name: 'PostgreSQL & Redis', role: language === 'EN' ? 'High Speed DB' : 'Yüksek Hızlı Depo' },
    { name: 'WhatsApp Cloud API', role: language === 'EN' ? 'Official Webhook' : 'Resmi Webhook' },
    { name: 'Binance WebSocket', role: language === 'EN' ? 'Realtime Stream' : 'Canlı Akış' }
  ];

  return (
    <section className="py-10 bg-white border-b border-slate-200/80 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500">
              {t('integrations.tag')}
            </p>
          </div>

          <span className="hidden sm:inline-block text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
            {language === 'EN' ? '100% Production Ready' : '%100 Canlı Uyumlu'}
          </span>
        </div>

        {/* Dynamic Interactive Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {stacks.map((item, i) => (
            <div 
              key={i} 
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-400 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center group cursor-default"
            >
              <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {item.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5 group-hover:text-slate-600">
                {item.role}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
