import React, { useState } from 'react';
import { useStore, CURRENCY_SYMBOLS } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import { generateCryptoLicenseKey, sanitizeInput } from '../utils/security';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  Download, 
  Copy, 
  Tag, 
  KeyRound,
  Check,
  Zap,
  Lock,
  Landmark,
  Coins
} from 'lucide-react';

export const CartDrawer = () => {
  const { 
    cart = [], 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    currency, 
    getProductPrice, 
    cartTotal = 0, 
    paymentSettings = {},
    couponsList = [],
    createOrder,
    addLicense,
    user, 
    addToast,
    t,
    language 
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const formatted = sanitizeInput(couponCode).toUpperCase().trim();
    const foundCoupon = couponsList.find((c) => c.code.toUpperCase() === formatted);

    if (foundCoupon) {
      setDiscountPercent(foundCoupon.discount);
      addToast(language === 'EN' ? `Coupon %${foundCoupon.discount} applied!` : `%${foundCoupon.discount} İndirim Kuponu (${foundCoupon.code}) uygulandı!`);
    } else if (formatted === 'KODRAN20' || formatted === 'DEV2026') {
      setDiscountPercent(20);
      addToast(language === 'EN' ? 'Coupon 20% discount applied!' : '%20 İndirim kuponu uygulandı!');
    } else {
      addToast(language === 'EN' ? 'Invalid coupon. Try: KODRAN20' : 'Geçersiz kupon kodu. Deneyin: KODRAN20', 'error');
    }
  };

  const discountAmount = Math.round((cartTotal * discountPercent) / 100);
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const handleCompleteOrder = () => {
    const cryptoKey = generateCryptoLicenseKey('KDR');
    setGeneratedKey(cryptoKey);
    setIsSuccess(true);

    const firstItem = cart[0];
    const prod = firstItem?.product || firstItem;
    const lic = firstItem?.license || firstItem?.licenseTier;

    if (createOrder) {
      createOrder({
        customerName: user?.name || user?.company || (language === 'EN' ? 'Enterprise Client' : 'Kurumsal Müşteri'),
        customerEmail: user?.email || 'client@company.com',
        productTitle: prod?.title || 'KODRAN Enterprise Suite',
        licenseType: lic?.type || (language === 'EN' ? 'Standard License' : 'Standart Lisans'),
        amount: finalTotal,
        currency,
        paymentMethod: paymentMethod === 'card' ? 'Credit Card (Stripe/Iyzico)' : paymentMethod === 'crypto' ? 'USDT TRC-20' : 'Bank Transfer / Wire',
        licenseKey: randomKey
      });
    }

    if (addLicense) {
      addLicense({
        key: randomKey,
        client: user?.name || user?.company || (language === 'EN' ? 'Enterprise Client' : 'Kurumsal Müşteri'),
        product: prod?.title || 'KODRAN Solution',
        type: lic?.type || (language === 'EN' ? 'Standard License' : 'Standart Lisans'),
        status: 'Aktif',
        created: new Date().toISOString().split('T')[0]
      });
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    clearCart();
    addToast(language === 'EN' ? 'Order completed! Your license key was generated.' : 'Sipariş başarıyla tamamlandı! Lisans kodunuz üretildi.');
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopiedKey(true);
    addToast(language === 'EN' ? 'License key copied!' : 'Lisans anahtarı kopyalandı!');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between text-slate-900 animate-in slide-in-from-right duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Drawer Header */}
          <div className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-slate-900 tracking-tight text-base">
                {t('cart.title')}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700">
                {cart.length} {language === 'EN' ? 'Items' : 'Kalem'}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* SUCCESS STATE */}
            {isSuccess ? (
              <div className="text-center py-8 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-xl font-extrabold text-slate-900">
                    {t('cart.successTitle')}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    {t('cart.successDesc')}
                  </p>
                </div>

                {/* Generated License Key Card */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 font-mono">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><KeyRound className="w-3.5 h-3.5 text-cyan-400" /> {t('cart.yourLicenseKey')}</span>
                    <span className="text-emerald-400 font-bold">{language === 'EN' ? 'ACTIVE' : 'AKTİF'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 text-xs font-bold select-all flex items-center justify-between">
                    <span>{generatedKey}</span>
                    <button
                      onClick={handleCopyKey}
                      className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title={t('cart.copyKey')}
                    >
                      {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4 space-y-2.5">
                  <button
                    onClick={() => {
                      addToast(language === 'EN' ? 'Software package is downloading...' : 'Yazılım paketi ve dökümantasyon indiriliyor...');
                      setTimeout(() => setIsCartOpen(false), 1500);
                    }}
                    className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{language === 'EN' ? 'Download Software Package (.ZIP)' : 'Yazılım Paketini İndir (.ZIP)'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setIsCheckingOut(false);
                      setIsCartOpen(false);
                    }}
                    className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {language === 'EN' ? 'Return to Store' : 'Mağazaya Geri Dön'}
                  </button>
                </div>
              </div>
            ) : cart.length === 0 ? (
              
              /* EMPTY CART */
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">{t('cart.emptyTitle')}</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {t('cart.emptyDesc')}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-indigo-600 transition-colors cursor-pointer"
                >
                  {t('cart.browseBtn')}
                </button>
              </div>

            ) : isCheckingOut ? (

              /* CHECKOUT PAYMENT FORM */
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                      {t('cart.paymentMethod')}
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-600 font-mono">
                      {paymentSettings.isLiveMode ? (language === 'EN' ? '● 256-Bit SSL Live' : '● 256-Bit SSL Canlı') : '● Test Sandbox'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'card', label: language === 'EN' ? 'Credit Card' : 'Kredi Kartı', icon: CreditCard },
                      { id: 'crypto', label: 'USDT TRC20', icon: Coins },
                      { id: 'bank', label: language === 'EN' ? 'Bank Transfer' : 'Havale/EFT', icon: Landmark },
                    ].map((method) => {
                      const MIcon = method.icon;
                      const isSelected = paymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`p-2.5 rounded-xl border font-semibold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <MIcon className="w-4 h-4" />
                          <span className="text-[11px]">{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-200/80">
                      <span>Gateway: <strong>Stripe & Iyzico 3D Secure</strong></span>
                      <span className="text-emerald-600 font-bold">256-Bit SSL</span>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        {language === 'EN' ? 'Card Number' : 'Kart Numarası'}
                      </label>
                      <input
                        type="text"
                        placeholder="•••• •••• •••• 4242"
                        defaultValue="4543 •••• •••• 8821"
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          {language === 'EN' ? 'Expiry Date' : 'Son Kullanma Tarihi'}
                        </label>
                        <input
                          type="text"
                          placeholder="12/28"
                          defaultValue="10/28"
                          className="w-full p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">CVC / CVV</label>
                        <input
                          type="text"
                          placeholder="•••"
                          defaultValue="842"
                          className="w-full p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'crypto' && (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 space-y-2.5 text-xs font-mono">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>USDT TRC-20 NETWORK</span>
                      <span className="text-emerald-400 font-bold">{language === 'EN' ? '0 Fee' : '0 Komisyon'}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 text-[11px] select-all break-all">
                      {paymentSettings.cryptoWallet || 'TX8892LaK91924821a99Zq001TRC20'}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {language === 'EN' ? 'Payment confirms in 1 block, generating license automatically.' : 'Ödeme 1 blok onayından sonra anında onaylanır ve lisans üretilir.'}
                    </p>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <p className="font-bold text-slate-800">{paymentSettings.bankAccountName || 'KODRAN TEKNOLOJİ YAZILIM A.Ş.'}</p>
                    <p className="text-slate-600">{paymentSettings.bankName || 'Garanti BBVA'}</p>
                    <p className="font-mono text-[11px] text-slate-800 bg-white p-2 rounded-lg border border-slate-200 select-all font-bold">
                      {paymentSettings.bankIban || 'TR42 0006 1000 0000 1234 5678 90'}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {language === 'EN' ? 'Please include your order email in the transfer description.' : 'Açıklama alanına sipariş e-posta adresinizi giriniz.'}
                    </p>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center gap-2.5 text-xs text-indigo-900">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{language === 'EN' ? 'End-to-end 256-bit SSL encrypted checkout.' : '256-Bit SSL uçtan uca şifrelemeyle güvenli ödeme.'}</span>
                </div>
              </div>

            ) : (

              /* CART ITEMS LIST */
              <div className="space-y-3">
                {cart.map((item) => {
                  if (!item) return null;
                  const prod = item.product || item;
                  const lic = item.license || item.licenseTier || prod.licenses?.[0] || { type: 'Standart Lisans', priceMultiplier: 1 };
                  const itemId = item.id || item.cartItemId || `${prod.id}-${lic.type}`;
                  const unitPrice = getProductPrice(prod, lic, currency);
                  const itemTotal = unitPrice * (item.quantity || 1);

                  return (
                    <div 
                      key={itemId} 
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{prod.title || item.title}</h4>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-indigo-700 font-mono">
                          {lic.type || (language === 'EN' ? 'Standard License' : 'Standart Lisans')}
                        </span>
                        <div className="text-xs font-extrabold font-mono text-slate-900 pt-1">
                          {CURRENCY_SYMBOLS[currency]}{itemTotal.toLocaleString('tr-TR')}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-slate-200 text-xs">
                          <button
                            onClick={() => updateQuantity(itemId, -1)}
                            className="p-1 hover:text-indigo-600 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-xs font-mono px-1">{item.quantity || 1}</span>
                          <button
                            onClick={() => updateQuantity(itemId, 1)}
                            className="p-1 hover:text-indigo-600 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(itemId)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title={language === 'EN' ? 'Delete' : 'Sil'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Dynamic Coupon Code Box */}
                <form onSubmit={handleApplyCoupon} className="pt-2 flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={t('cart.couponPlaceholder')}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs uppercase font-mono font-semibold focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t('cart.applyCoupon')}
                  </button>
                </form>
              </div>

            )}

          </div>

          {/* Drawer Footer Actions */}
          {cart.length > 0 && !isSuccess && (
            <div className="p-6 bg-white border-t border-slate-100 space-y-4">
              
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-mono">{CURRENCY_SYMBOLS[currency]}{cartTotal.toLocaleString('tr-TR')}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>{t('cart.discount')} (%{discountPercent}):</span>
                    <span className="font-mono">-{CURRENCY_SYMBOLS[currency]}{discountAmount.toLocaleString('tr-TR')}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                  <span>{t('cart.total')}</span>
                  <span className="font-mono text-xl">{CURRENCY_SYMBOLS[currency]}{finalTotal.toLocaleString('tr-TR')}</span>
                </div>
              </div>

              {isCheckingOut ? (
                <div className="space-y-2">
                  <button
                    onClick={handleCompleteOrder}
                    className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{t('cart.completeOrder')} ({CURRENCY_SYMBOLS[currency]}{finalTotal.toLocaleString('tr-TR')})</span>
                  </button>

                  <button
                    onClick={() => setIsCheckingOut(false)}
                    className="w-full py-2.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    ← {language === 'EN' ? 'Back to Cart' : 'Sepete Geri Dön'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-slate-900/10 hover:shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{language === 'EN' ? 'Proceed to Checkout' : 'Ödemeye Geç'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
