import React, { useState } from 'react';
import { useStore, CURRENCY_SYMBOLS } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown, 
  Check, 
  User, 
  Sparkles, 
  LogOut, 
  LayoutDashboard,
  Layers,
  ShieldCheck,
  Star,
  ArrowRight,
  Globe
} from 'lucide-react';

export const Navbar = () => {
  const { 
    currentView, 
    setCurrentView, 
    cartCount, 
    setIsCartOpen, 
    currency, 
    setCurrency, 
    language,
    setLanguage,
    t,
    setIsCustomOrderOpen, 
    setIsLoginModalOpen, 
    user, 
    logout 
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localeDropdownOpen, setLocaleDropdownOpen] = useState(false);

  const currencies = ['TRY', 'USD', 'EUR'];
  const languages = [
    { code: 'TR', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'EN', name: 'English', flag: '🇬🇧' }
  ];

  return (
    <header className="fixed top-2 sm:top-4 left-0 right-0 z-50 px-2 sm:px-8 pointer-events-none">
      <div className="max-w-6xl mx-auto pointer-events-auto">
        
        {/* Floating Glassmorphic Dynamic Island Navigation Bar */}
        <nav className="rounded-full bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-lg shadow-slate-900/5 px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3 sm:gap-4 transition-all duration-300">
          
          {/* 1. LEFT: Brand Logo */}
          <a 
            href="#" 
            onClick={() => setCurrentView('store')}
            className="flex items-center gap-2 group select-none shrink-0"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-xs sm:text-sm shadow-md group-hover:bg-indigo-600 transition-colors duration-200 shrink-0">
              K
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base whitespace-nowrap">
              KODRAN<span className="text-indigo-600">.DEV</span>
            </span>
          </a>

          {/* 2. CENTER: Clean Navigation Links (Desktop) */}
          {currentView === 'store' && (
            <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/60 text-xs font-semibold text-slate-600">
              <a 
                href="#products" 
                className="px-4 py-1.5 rounded-full hover:bg-white hover:text-slate-900 hover:shadow-xs transition-all duration-150"
              >
                {t('nav.softwarePool')}
              </a>
              
              <a 
                href="#enterprise" 
                className="px-4 py-1.5 rounded-full hover:bg-white hover:text-slate-900 hover:shadow-xs transition-all duration-150"
              >
                {t('nav.architecture')}
              </a>

              <a 
                href="#reviews" 
                className="px-4 py-1.5 rounded-full hover:bg-white hover:text-slate-900 hover:shadow-xs transition-all duration-150"
              >
                {t('nav.reviews')}
              </a>
            </div>
          )}

          {/* 3. RIGHT: Actions Stack */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto lg:ml-0">
            
            {/* Unified Single Localization Dropdown (Language + Currency in ONE place) */}
            <div className="relative shrink-0">
              <button
                onClick={() => setLocaleDropdownOpen(!localeDropdownOpen)}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100/90 hover:bg-slate-200/80 hover:text-indigo-600 transition-all cursor-pointer shrink-0 border border-slate-200/70 shadow-2xs"
                title={language === 'EN' ? 'Language & Currency Settings' : 'Dil ve Para Birimi Seçimi'}
              >
                <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="font-mono font-bold tracking-tight">{language}</span>
                <span className="text-slate-300 font-normal hidden sm:inline">|</span>
                <span className="font-mono font-bold text-slate-800 hidden sm:inline">{CURRENCY_SYMBOLS[currency]} {currency}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${localeDropdownOpen ? 'rotate-180 text-indigo-600' : ''}`} />
              </button>

              {localeDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2.5 w-56 rounded-2xl bg-white shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95 space-y-3"
                  onMouseLeave={() => setLocaleDropdownOpen(false)}
                >
                  {/* Language Section */}
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1.5 px-1">
                      {language === 'EN' ? 'Language / Dil' : 'Görüntüleme Dili'}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setLocaleDropdownOpen(false);
                          }}
                          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            language === lang.code
                              ? 'bg-indigo-600 text-white font-bold shadow-xs'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                          }`}
                        >
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Currency Section */}
                  <div className="pt-2.5 border-t border-slate-100">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1.5 px-1">
                      {language === 'EN' ? 'Currency / Para Birimi' : 'Para Birimi'}
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {currencies.map((curr) => (
                        <button
                          key={curr}
                          onClick={() => {
                            setCurrency(curr);
                            setLocaleDropdownOpen(false);
                          }}
                          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs transition-all cursor-pointer ${
                            currency === curr
                              ? 'bg-slate-900 text-white font-bold shadow-xs'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                          }`}
                        >
                          <span className="font-mono font-extrabold">{CURRENCY_SYMBOLS[curr]}</span>
                          <span className="text-[10px] font-mono">{curr}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-indigo-600 transition-all cursor-pointer shrink-0"
              title={t('nav.cart')}
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Login / Dashboard Desktop */}
            {user ? (
              <div className="hidden md:flex items-center gap-1.5">
                {user.role === 'admin' && (
                  <button
                    onClick={() => setCurrentView(currentView === 'admin' ? 'store' : 'admin')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>{currentView === 'admin' ? 'Mağaza' : 'Panel'}</span>
                  </button>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                  title={t('nav.logout')}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('nav.login')}</span>
              </button>
            )}

            {/* Standout Primary CTA */}
            <button
              onClick={() => setIsCustomOrderOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold shadow-md shadow-slate-900/10 hover:shadow-indigo-600/25 transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>{t('nav.customOrder')}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors cursor-pointer shrink-0"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>

        </nav>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-4 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-2xl animate-in slide-in-from-top-4 duration-200 space-y-3">
            
            {/* Mobile Primary CTA */}
            <button
              onClick={() => {
                setIsCustomOrderOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>{t('nav.customOrder')}</span>
            </button>

            <div className="space-y-1 pb-3 border-b border-slate-100 font-medium text-xs">
              <a 
                href="#products" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                {t('nav.softwarePool')}
              </a>
              <a 
                href="#enterprise" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                {t('nav.architecture')}
              </a>
              <a 
                href="#reviews" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                {t('nav.reviews')}
              </a>
            </div>

            {/* Mobile Language, Currency & Auth Actions */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between gap-2">
                {/* Languages */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs ${
                        language === l.code ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      {l.code}
                    </button>
                  ))}
                </div>

                {/* Currencies */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {currencies.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`px-2 py-1 rounded-lg font-mono font-bold text-xs ${
                        currency === c ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      {CURRENCY_SYMBOLS[c]} {c}
                    </button>
                  ))}
                </div>
              </div>

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  {t('nav.logout')}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold"
                >
                  {t('nav.login')}
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </header>
  );
};
