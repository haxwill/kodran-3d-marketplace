import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, CheckCircle2, Terminal, Activity, Database, Bot, TrendingUp, Cpu, Server, Code2, Radio } from 'lucide-react';

export const Testimonials = () => {
  const { t, language } = useStore();
  const [liveCounter, setLiveCounter] = useState(250140);
  const [liveMs, setLiveMs] = useState(2.3);

  // Live telemetry pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounter((prev) => prev + Math.floor(Math.random() * 14) + 2);
      setLiveMs((Math.random() * 0.4 + 2.1).toFixed(1));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const productionSystems = language === 'EN' ? [
    {
      title: 'Multi-Marketplace Price & Inventory Scraper Engine',
      category: 'E-Commerce & Scraping',
      icon: Database,
      badge: 'Live Stream',
      metric: `${liveCounter.toLocaleString('en-US')} SKUs`,
      metricLabel: t('testimonials.skuProcessed'),
      tech: 'Python 3.12 • Playwright Stealth • Redis • PostgreSQL',
      summary: 'Distributed bot architecture gathering daily price, stock, and merchant changes across Amazon, Trendyol, and major e-commerce platforms without Cloudflare blocks.',
      architecture: [
        'Automated Residential Proxy Pool & Smart IP Rotation',
        'TLS/JA3 Real Browser Fingerprint Spoofing Engine',
        'PostgreSQL & ElasticSearch Vectorized Storage'
      ]
    },
    {
      title: 'WhatsApp & Telegram Autonomous Sales AI Agent',
      category: 'AI & Customer Automation',
      icon: Bot,
      badge: 'Live Integration',
      metric: '99.4% Automated',
      metricLabel: t('testimonials.aiResolution'),
      tech: 'TypeScript • OpenAI GPT-4o • WhatsApp Cloud API • Vector DB',
      summary: 'RAG-powered conversational bot scanning catalogs to answer 24/7 client inquiries, check real-time stock, and generate instant secure payment links.',
      architecture: [
        'Advanced RAG (Retrieval-Augmented Generation) Architecture',
        'In-Chat Stripe / Iyzico Secure 3D Checkout Links',
        'Seamless Fallback & Handover to Live Human Agents'
      ]
    },
    {
      title: 'CEX / DEX High-Frequency Arbitrage Core',
      category: 'Fintech & Algorithmic Trading',
      icon: TrendingUp,
      badge: 'Millisecond Level',
      metric: `${liveMs} ms`,
      metricLabel: t('testimonials.latencyLabel'),
      tech: 'Rust Tokio • Web3.py • Binance WebSocket • Bybit API',
      summary: 'Ultra low-latency spread engine capturing real-time price differentials between Binance, Bybit, and Uniswap with built-in slippage and MEV protection.',
      architecture: [
        'Zero Memory Leak Async Rust Tokio Event Loop',
        'Dynamic Stop-Loss & Real-time Liquidity Tracking',
        'Instant Telegram Channel PnL & Profit Alerts'
      ]
    }
  ] : [
    {
      title: 'Çoklu Pazaryeri Fiyat & Stok Tarama Motoru',
      category: 'E-Ticaret & Scraping',
      icon: Database,
      badge: 'Canlı Akış',
      metric: `${liveCounter.toLocaleString('tr-TR')} SKU`,
      metricLabel: t('testimonials.skuProcessed'),
      tech: 'Python 3.12 • Playwright Stealth • Redis • PostgreSQL',
      summary: 'Trendyol, Hepsiburada ve Amazon Türkiye üzerinden günlük 250K ürünün fiyat, stok ve satıcı değişimlerini Cloudflare engeline takılmadan toplayan dağıtık bot sistemi.',
      architecture: [
        'Otomatik Residential Proxy Havuzu ve IP Rotasyonu',
        'TLS/JA3 Parmak İzi (Fingerprint) Taklit Motoru',
        'PostgreSQL ve ElasticSearch Vektör Depolama'
      ]
    },
    {
      title: 'WhatsApp & Telegram Otonom Satış Asistanı',
      category: 'AI & Müşteri Otomasyonu',
      icon: Bot,
      badge: 'Canlı Entegrasyon',
      metric: '%99.4 Otomatik Yanıt',
      metricLabel: t('testimonials.aiResolution'),
      tech: 'TypeScript • OpenAI GPT-4o • WhatsApp Cloud API • Vector DB',
      summary: 'İşletmelerin PDF ürün kataloglarını ve fiyat listelerini RAG teknolojisiyle tarayarak müşterilere 7/24 anında doğru fiyat veren, stok sorgulayan ve sipariş oluşturan yapay zeka botu.',
      architecture: [
        'Gelişmiş RAG (Retrieval-Augmented Generation) Mimarisi',
        'Sohbet İçinde Iyzico / Stripe Güvenli Ödeme Linki',
        'Gerektiğinde Canlı Müşteri Temsilcisine Otomatik Devir'
      ]
    },
    {
      title: 'CEX / DEX Yüksek Hızlı Arbitraj Motoru',
      category: 'Finans & Algoritmik İşlem',
      icon: TrendingUp,
      badge: 'Milisaniyelik',
      metric: `${liveMs} ms`,
      metricLabel: t('testimonials.latencyLabel'),
      tech: 'Rust Tokio • Web3.py • Binance WebSocket • Bybit API',
      summary: 'Binance, Bybit ve merkeziyetsiz borsalar (Uniswap) arasındaki anlık spread farklarını milisaniyeler içinde yakalayan, slippage ve MEV korumalı algoritmik ticaret çekirdeği.',
      architecture: [
        'Sıfır Bellek Sızıntılı Async Rust Tokio İşlem Döngüsü',
        'Zarar Durdur (Stop-Loss) ve Dinamik Likidite Takibi',
        'Telegram Kanalına Anlık PnL ve Kâr Bildirimi'
      ]
    }
  ];

  return (
    <section id="reviews" className="py-24 bg-white border-b border-slate-200/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider font-mono">
                {t('testimonials.tag')}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t('testimonials.title')}
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-normal">
              {t('testimonials.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-5 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>{language === 'EN' ? '24/7 Continuous Production' : '7/24 Kesintisiz Üretim'}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>{language === 'EN' ? 'Open Source & Autonomous' : 'Açık Kaynak & Bağımsız Kod'}</span>
            </div>
          </div>
        </div>

        {/* 3 Real Production Architectures */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {productionSystems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="relative rounded-3xl bg-slate-50/70 border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between hover:bg-white hover:border-indigo-300 hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  {/* Top Bar: Category & Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <span className="text-[11px] font-mono font-bold text-indigo-600 uppercase tracking-wide">
                      {item.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-start gap-3.5 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200/90 text-slate-800 flex items-center justify-center font-bold shrink-0 shadow-2xs group-hover:text-indigo-600 group-hover:scale-105 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {/* Big Real Metric Highlight */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 mb-5 shadow-2xs group-hover:border-indigo-100 transition-colors">
                    <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tracking-tight transition-all">
                      {item.metric}
                    </div>
                    <div className="text-xs font-semibold text-slate-500 mt-0.5">
                      {item.metricLabel}
                    </div>
                  </div>

                  {/* Real Technical Summary */}
                  <p className="text-xs text-slate-600 leading-relaxed font-normal mb-5">
                    {item.summary}
                  </p>

                  {/* Architectural Highlights */}
                  <div className="space-y-2 pt-4 border-t border-slate-200/70 mb-5 text-xs text-slate-700 font-medium">
                    {item.architecture.map((arch, aIdx) => (
                      <div key={aIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="text-[11px] leading-tight">{arch}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Footer */}
                <div className="pt-4 border-t border-slate-200/70">
                  <span className="text-[10px] font-mono text-slate-400 font-medium block truncate">
                    {item.tech}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
