import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { sanitizeInput } from '../utils/security';
import { 
  X, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Database, 
  Bot, 
  TrendingUp, 
  Layers, 
  ShieldCheck,
  Zap,
  MessageSquare
} from 'lucide-react';

export const CustomOrderModal = () => {
  const { isCustomOrderOpen, setIsCustomOrderOpen, addCustomOrder, addToast, t, language } = useStore();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState('scraping');
  const [budget, setBudget] = useState(language === 'EN' ? '$1,000 - $3,000' : '₺15.000 - ₺35.000');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isCustomOrderOpen) return null;

  const categories = [
    { id: 'scraping', label: language === 'EN' ? 'Web Scraping & Data Extraction' : 'Veri Kazıma & Scraping', icon: Database },
    { id: 'bot', label: language === 'EN' ? 'Autonomous AI & Sales Bot' : 'AI & Otomasyon Botu', icon: Bot },
    { id: 'fintech', label: language === 'EN' ? 'Algorithmic Arbitrage & Trading' : 'Borsa & Arbitraj Algoritması', icon: TrendingUp },
    { id: 'saas', label: language === 'EN' ? 'Custom SaaS / Web Platform' : 'Özel SaaS / Web Platformu', icon: Layers },
  ];

  const budgets = language === 'EN' ? [
    '$500 - $1,500',
    '$1,500 - $3,500',
    '$3,500 - $10,000+',
    'Enterprise Custom'
  ] : [
    '₺10.000 - ₺25.000',
    '₺25.000 - ₺50.000',
    '₺50.000 - ₺100.000+',
    'Kurumsal / Özel Bütçe'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !contact || !details) {
      addToast(language === 'EN' ? 'Please fill in all required fields.' : 'Lütfen tüm zorunlu alanları doldurun.', 'error');
      return;
    }

    const cleanName = sanitizeInput(name);
    const cleanContact = sanitizeInput(contact);
    const cleanDetails = sanitizeInput(details);

    const newLead = {
      id: `LEAD-${Date.now().toString(36).toUpperCase()}`,
      name: cleanName,
      contact: cleanContact,
      category,
      budget,
      details: cleanDetails,
      status: language === 'EN' ? 'New' : 'Yeni',
      date: language === 'EN' ? 'Just Now' : 'Az Önce'
    };

    addCustomOrder(newLead);
    setSubmitted(true);
    addToast(language === 'EN' ? 'Inquiry received! Forwarded to engineering team.' : 'Talebiniz başarıyla alındı! Mühendislik ekibine iletildi.');
  };

  const handleClose = () => {
    setIsCustomOrderOpen(false);
    setSubmitted(false);
    setName('');
    setContact('');
    setDetails('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={handleClose} />

      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-slate-950/20 text-slate-900 p-6 sm:p-8 animate-in zoom-in-95 duration-200 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          title={t('modal.close')}
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          
          /* SUCCESS SCREEN */
          <div className="text-center py-10 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {t('customOrder.successTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                {t('customOrder.successDesc')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 max-w-sm mx-auto space-y-1 text-left">
              <p><span className="font-bold text-slate-900">{t('customOrder.nameLabel')}:</span> {name}</p>
              <p><span className="font-bold text-slate-900">{t('customOrder.contactLabel')}:</span> {contact}</p>
              <p><span className="font-bold text-slate-900">{t('customOrder.budgetLabel')}:</span> {budget}</p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://t.me/kodran_dev"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{language === 'EN' ? 'Telegram VIP Support' : 'Telegram VIP Destek Kanalı'}</span>
              </a>

              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                {t('customOrder.close')}
              </button>
            </div>
          </div>

        ) : (

          /* INQUIRY FORM */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-mono font-bold mb-2 border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>{language === 'EN' ? 'BESPOKE ENTERPRISE ARCHITECTURE' : 'KURUMSAL ÖZEL MİMARİ'}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {t('customOrder.title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {t('customOrder.subtitle')}
              </p>
            </div>

            {/* Category Select */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2 font-mono">
                {t('customOrder.categoryLabel')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-xl border font-semibold text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-600 text-indigo-700 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inputs: Name & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {t('customOrder.nameLabel')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'EN' ? 'e.g. Alex Morgan (Nova Logistics)' : 'Örn: Mert Aksoy (Demir Lojistik)'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {t('customOrder.contactLabel')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'EN' ? '@username or contact@company.com' : '@kullaniciadi veya iletisim@sirket.com'}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2 font-mono">
                {t('customOrder.budgetLabel')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {budgets.map((b, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setBudget(b)}
                    className={`p-2.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                      budget === b
                        ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Project Details */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                {t('customOrder.detailsLabel')} *
              </label>
              <textarea
                required
                rows={3}
                placeholder={t('customOrder.detailsPlaceholder')}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-slate-900/10 hover:shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{t('customOrder.submitBtn')}</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium pt-3">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {language === 'EN' ? 'Non-Disclosure Agreement (NDA) Protected' : 'Gizlilik Sözleşmesi (NDA) Güvencesi'}</span>
                <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-indigo-600" /> {language === 'EN' ? 'Response within 2 Hours' : '2 Saat İçinde Teknik Dönüş'}</span>
              </div>
            </div>

          </form>

        )}

      </div>
    </div>
  );
};
