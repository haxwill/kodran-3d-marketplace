import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Zap, Github, Send, Sparkles, Lock, ArrowRight, Check } from 'lucide-react';

export const Footer = () => {
  const { setCurrentView, setIsLoginModalOpen, setIsCustomOrderOpen, addToast, addAuditLog, t, language } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    if (addAuditLog) {
      addAuditLog('Yeni E-Bülten Abonesi', `${newsletterEmail} bültene kaydoldu.`);
    }
    addToast(t('footer.subscribed'));
  };

  return (
    <footer className="bg-white text-slate-900 border-t border-slate-200/80 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-200/80">
          
          {/* Brand & Newsletter (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
                K
              </div>
              <span className="font-extrabold text-slate-900 tracking-tight text-base">
                KODRAN<span className="text-indigo-600">.DEV</span>
              </span>
            </div>

            <p className="text-slate-500 text-xs leading-relaxed max-w-sm font-normal">
              {t('footer.desc')}
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 font-mono">
                {t('footer.newsletterTitle')}
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{t('footer.subscribed')}</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    placeholder={t('footer.newsletterPlaceholder')}
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white font-medium transition-all"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{t('footer.subscribeBtn')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs font-mono">
              {language === 'EN' ? 'Software Solutions' : 'Yazılım Çözümleri'}
            </h4>
            <ul className="space-y-2 text-slate-500 text-xs font-medium">
              <li><a href="#products" className="hover:text-indigo-600 transition-colors">AutoScrape Enterprise</a></li>
              <li><a href="#products" className="hover:text-indigo-600 transition-colors">OmniBot AI Asistan</a></li>
              <li><a href="#products" className="hover:text-indigo-600 transition-colors">ArbitrageX Engine</a></li>
              <li><a href="#products" className="hover:text-indigo-600 transition-colors">CloudDeploy CLI</a></li>
              <li><a href="#products" className="hover:text-indigo-600 transition-colors">SaaS Master Kit</a></li>
            </ul>
          </div>

          {/* Company & Support (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs font-mono">
              {language === 'EN' ? 'Enterprise & Support' : 'Kurumsal & Destek'}
            </h4>
            <ul className="space-y-2 text-slate-500 text-xs font-medium">
              <li>
                <button onClick={() => setIsCustomOrderOpen(true)} className="hover:text-indigo-600 transition-colors cursor-pointer text-left">
                  {t('nav.customOrder')}
                </button>
              </li>
              <li>
                <button onClick={() => setIsLoginModalOpen(true)} className="hover:text-indigo-600 transition-colors cursor-pointer text-left">
                  {language === 'EN' ? 'My Account & Licenses' : 'Hesabım & Lisans Sorgulama'}
                </button>
              </li>
              <li><a href="#enterprise" className="hover:text-indigo-600 transition-colors">{t('nav.architecture')}</a></li>
              <li><a href="#reviews" className="hover:text-indigo-600 transition-colors">{t('nav.reviews')}</a></li>
            </ul>

            <div className="pt-3">
              <a
                href="https://t.me/kodran_dev"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 text-xs font-bold transition-all shadow-2xs"
              >
                <Send className="w-3.5 h-3.5 text-indigo-600" />
                <span>{language === 'EN' ? 'Telegram VIP Support Desk' : 'Telegram VIP Destek Kanalı'}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Trust Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2026 KODRAN.DEV. {t('footer.rights')}</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-600 cursor-pointer">{t('footer.privacy')}</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">{t('footer.terms')}</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">{t('footer.licenseAgreement')}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
