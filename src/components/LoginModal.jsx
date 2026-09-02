import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ApiService } from '../services/api';
import { 
  X, 
  Lock, 
  User, 
  KeyRound, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  Phone, 
  Mail, 
  CheckCircle2, 
  UserPlus, 
  LogIn, 
  RotateCcw, 
  Check 
} from 'lucide-react';

export const LoginModal = () => {
  const { 
    isLoginModalOpen, 
    setIsLoginModalOpen, 
    login, 
    register, 
    setCurrentView, 
    addToast, 
    t, 
    language
  } = useStore();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot_password'

  // Login form state
  const [emailOrPin, setEmailOrPin] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    const val = emailOrPin.trim();
    if (!val) return;

    setIsSubmitting(true);

    // Identify if attempting administrative authentication
    const isAttemptingAdmin = val.toLowerCase().includes('admin') || !val.includes('@') || Boolean(loginPassword);

    if (isAttemptingAdmin) {
      try {
        const res = await ApiService.adminLogin(val, loginPassword);
        if (res && res.user) {
          login(res.user);
          setIsLoginModalOpen(false);
          setCurrentView('admin');
          addToast(language === 'EN' ? 'Logged into Admin Dashboard!' : 'Yönetici Paneline Giriş Yapıldı!');
        }
      } catch (err) {
        if (err.status === 429) {
          addToast(
            language === 'EN'
              ? `🔒 Rate limit exceeded. Please wait ${err.remainingSec || 300}s.`
              : `🔒 Çok sayıda başarısız deneme yapıldı. Lütfen ${err.remainingSec || 300} saniye bekleyin.`,
            'error'
          );
        } else {
          // Generic error requirement: "Giriş bilgileri geçersiz."
          addToast(
            language === 'EN' ? 'Invalid credentials.' : 'Giriş bilgileri geçersiz.',
            'error'
          );
        }
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Standard client / customer login
    login({
      id: `usr_${Date.now().toString(36)}`,
      email: val || 'client@company.com',
      role: 'customer',
      name: val.split('@')[0] || (language === 'EN' ? 'Client' : 'Müşteri'),
      company: language === 'EN' ? 'Enterprise Client' : 'Kurumsal Müşteri'
    });
    setIsLoginModalOpen(false);
    setIsSubmitting(false);
    addToast(language === 'EN' ? 'Login successful! Welcome back.' : 'Giriş Başarılı! Hoş geldiniz.');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) return;

    register({
      name: regName,
      company: regCompany,
      email: regEmail,
      phone: regPhone,
      password: regPassword
    });

    setIsLoginModalOpen(false);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setResetSent(true);
    addToast(language === 'EN' ? 'Password reset link sent to your email!' : 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsLoginModalOpen(false)} />

      <div 
        className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-slate-950/20 text-slate-900 p-7 sm:p-8 animate-in zoom-in-95 duration-200 z-10 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          title={t('modal.close')}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              {authMode === 'forgot_password' ? <RotateCcw className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider font-mono">
              {language === 'EN' ? 'KODRAN ACCOUNT PORTAL' : 'KODRAN HESAP MERKEZİ'}
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {authMode === 'login' && (language === 'EN' ? 'Sign In to Portal' : 'Giriş Yapın')}
            {authMode === 'register' && (language === 'EN' ? 'Create Enterprise Account' : 'Kurumsal Hesap Oluşturun')}
            {authMode === 'forgot_password' && (language === 'EN' ? 'Reset Password' : 'Şifrenizi Sıfırlayın')}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {authMode === 'login' && (language === 'EN' ? 'Sign in to access your purchased licenses and source code packages.' : 'Lisanslarınızı yönetmek ve siparişlerinizi indirmek için giriş yapın.')}
            {authMode === 'register' && (language === 'EN' ? 'Sign up to manage software licenses and cryptographic keys.' : 'Yazılım lisansları ve API anahtarlarınızı yönetmek için hemen kayıt olun.')}
            {authMode === 'forgot_password' && (language === 'EN' ? 'We will send reset instructions to your registered email.' : 'Kayıtlı e-posta adresinize sıfırlama talimatı göndereceğiz.')}
          </p>
        </div>

        {/* Tab Switcher */}
        {authMode !== 'forgot_password' && (
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('auth.loginTab')}</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t('auth.registerTab')}</span>
            </button>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                {language === 'EN' ? 'Email Address or Administrator' : 'E-Posta Adresi veya Yönetici'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  placeholder={language === 'EN' ? 'name@company.com or Administrator' : 'ornek@sirket.com veya Yönetici'}
                  value={emailOrPin}
                  onChange={(e) => setEmailOrPin(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {t('auth.passwordLabel')}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(emailOrPin);
                    setAuthMode('forgot_password');
                    setResetSent(false);
                  }}
                  className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  {t('auth.forgotPrompt')}
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('auth.loginBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 2. REGISTER FORM */}
        {authMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t('auth.nameLabel')}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder={language === 'EN' ? 'John Doe' : 'Ahmet Yılmaz'}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('auth.companyLabel')}
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={language === 'EN' ? 'Nexus Corp' : 'XYZ Lojistik A.Ş.'}
                    value={regCompany}
                    onChange={(e) => setRegCompany(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('auth.phoneLabel')}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="+90 532... / @user"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t('auth.emailLabel')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder={language === 'EN' ? 'john@company.com' : 'ahmet@sirket.com'}
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t('auth.passwordLabel')}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer pt-3"
            >
              <span>{t('auth.registerBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD FORM */}
        {authMode === 'forgot_password' && (
          <div className="space-y-4">
            {resetSent ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {language === 'EN' ? 'Reset Link Sent!' : 'Sıfırlama Bağlantısı Gönderildi!'}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  <strong className="text-slate-800">{forgotEmail}</strong> {language === 'EN' ? 'has received password reset instructions. Please check your inbox.' : 'adresine şifre yenileme e-postası iletildi. Lütfen gelen kutunuzu kontrol edin.'}
                </p>
                <button
                  onClick={() => setAuthMode('login')}
                  className="w-full py-3 rounded-xl bg-slate-900 text-white text-xs font-bold transition-all cursor-pointer mt-2"
                >
                  {t('auth.backToLogin')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    {language === 'EN' ? 'Registered Email Address' : 'Kayıtlı E-Posta Adresiniz'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder={language === 'EN' ? 'john@company.com' : 'ahmet@sirket.com'}
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t('auth.resetBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="w-full py-2 text-center text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  ← {t('auth.backToLogin')}
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
