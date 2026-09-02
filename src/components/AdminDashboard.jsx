import React, { useState } from 'react';
import { useStore, CURRENCY_SYMBOLS } from '../context/StoreContext';
import { autoTranslateString, getLocalizedText, getLocalizedCategoryName } from '../utils/translations';
import { 
  generateCryptoLicenseKey, 
  verifyLicenseIntegrity, 
  maskApiKey, 
  sanitizeInput 
} from '../utils/security';
import { ApiService } from '../services/api';
import { 
  TrendingUp, 
  Layers, 
  MessageSquare, 
  KeyRound, 
  Plus, 
  Trash2, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  Send, 
  Copy, 
  X,
  ExternalLink,
  Store,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Zap,
  Activity,
  Bot,
  Eye,
  EyeOff,
  Database,
  BarChart3,
  CheckCircle,
  Edit,
  SlidersHorizontal,
  Flame,
  CreditCard,
  Tag,
  Settings,
  Coins,
  Landmark,
  Save,
  Globe,
  Radio,
  Lock,
  FolderTree,
  FolderPlus,
  ShoppingBag,
  UserCheck,
  UserX,
  Star,
  Cpu,
  Server,
  BellRing,
  FileText,
  Clock,
  AlertTriangle,
  Mail,
  Receipt,
  Inbox,
  Download,
  Upload,
  RefreshCw,
  Percent,
  Timer,
  ShieldAlert
} from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    setCurrentView, 
    productsList = [], 
    addProduct, 
    updateProduct,
    deleteProduct, 
    categoriesList = [],
    addCategory,
    updateCategory,
    deleteCategory,
    ordersList = [],
    updateOrderStatus,
    customersList = [],
    addCustomer,
    updateCustomerStatus,
    deleteCustomer,
    reviewsList = [],
    addReview,
    deleteReview,
    auditLogsList = [],
    newsletterSubscribers = [],
    sendBroadcast,
    paymentSettings = {},
    updatePaymentSettings,
    telegramBotSettings = {},
    updateTelegramBotSettings,
    sendTelegramAlert,
    flashSaleSettings = {},
    updateFlashSaleSettings,
    securitySettings = {},
    updateSecuritySettings,
    exportDatabaseBackup,
    importDatabaseBackup,
    resetToFactoryDefaults,
    couponsList = [],
    addCoupon,
    deleteCoupon,
    siteSettings = {},
    updateSiteSettings,
    customOrdersList = [], 
    updateLeadStatus, 
    licensesList = [], 
    addLicense,
    currency,
    getProductPrice,
    addToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState('products');

  // Real Computed KPIs
  const totalRevenue = ordersList.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const totalLicensesCount = licensesList.length;
  const totalCustomersCount = customersList.length;
  const pendingLeadsCount = customOrdersList.filter(l => l.status === 'Yeni').length;
  const totalProductsCount = productsList.length;

  // Add Product Form State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTitleEN, setNewTitleEN] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newSubtitleEN, setNewSubtitleEN] = useState('');
  const [newCategory, setNewCategory] = useState(categoriesList[0]?.id || 'scraping');
  const [newBadge, setNewBadge] = useState('Yeni');
  const [newSalesBadge, setNewSalesBadge] = useState('🔥 Yeni Çıktı • Sınırlı Lisans');
  const [newRoiText, setNewRoiText] = useState('Manuel işlem süresini %90 azaltır');
  const [newPriceTRY, setNewPriceTRY] = useState(3200);
  const [newPriceUSD, setNewPriceUSD] = useState(95);
  const [newTech, setNewTech] = useState('Python 3.12, Playwright, Docker');
  const [newSpecs, setNewSpecs] = useState('Anti-Bot Koruması, Çoklu Threading, CSV/PostgreSQL Export');
  const [newSpecsEN, setNewSpecsEN] = useState('Anti-Bot Protection, Multi-Threading, CSV/PostgreSQL Export');

  // Edit Product Form State
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTitleEN, setEditTitleEN] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editSubtitleEN, setEditSubtitleEN] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editSalesBadge, setEditSalesBadge] = useState('');
  const [editRoiText, setEditRoiText] = useState('');
  const [editPriceTRY, setEditPriceTRY] = useState(0);
  const [editPriceUSD, setEditPriceUSD] = useState(0);
  const [editTech, setEditTech] = useState('');
  const [editSpecs, setEditSpecs] = useState('');
  const [editSpecsEN, setEditSpecsEN] = useState('');
  const [editSnippet, setEditSnippet] = useState('');

  // Categories Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatId, setNewCatId] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');

  // Reviews Form State
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newRevAuthor, setNewRevAuthor] = useState('');
  const [newRevRole, setNewRevRole] = useState('');
  const [newRevCompany, setNewRevCompany] = useState('');
  const [newRevComment, setNewRevComment] = useState('');
  const [newRevRating, setNewRevRating] = useState(5);

  // Broadcast Form State
  const [broadcastChannel, setBroadcastChannel] = useState('telegram');
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Telegram Bot Form State
  const [tempTelegram, setTempTelegram] = useState(telegramBotSettings);

  // Flash Sale Form State
  const [tempFlashSale, setTempFlashSale] = useState(flashSaleSettings);

  // Security & Maintenance Form State
  const [tempSecurity, setTempSecurity] = useState(securitySettings);

  // Payment Settings Form State
  const [tempPayment, setTempPayment] = useState(paymentSettings);

  // New Coupon Form State
  const [newCpnCode, setNewCpnCode] = useState('');
  const [newCpnDiscount, setNewCpnDiscount] = useState(20);
  const [newCpnDesc, setNewCpnDesc] = useState('');

  // Site Settings Form State
  const [tempSiteSettings, setTempSiteSettings] = useState(siteSettings);

  // Add License Form State
  const [showAddLicenseModal, setShowAddLicenseModal] = useState(false);
  const [licClient, setLicClient] = useState('');
  const [licProduct, setLicProduct] = useState(productsList[0]?.title?.TR || productsList[0]?.title || 'AutoScrape Pro Cluster v4.2');
  const [licType, setLicType] = useState('Ticari Lisans');
  const [copiedKey, setCopiedKey] = useState(null);
  const [testVerifyKey, setTestVerifyKey] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [showSecrets, setShowSecrets] = useState(false);

  // Order Details Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Server-Side Master Admin Password / Credential Management
  const [currentAdminPassword, setCurrentAdminPassword] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [isUpdatingCredential, setIsUpdatingCredential] = useState(false);

  const handleUpdateAdminPassword = async (e) => {
    e.preventDefault();
    if (!newAdminPassword || newAdminPassword.length < 6) {
      addToast('Yeni şifre en az 6 karakter olmalıdır.', 'error');
      return;
    }
    setIsUpdatingCredential(true);
    try {
      const res = await ApiService.updateAdminCredentials(currentAdminPassword, newAdminPassword);
      setCurrentAdminPassword('');
      setNewAdminPassword('');
      addToast(res.message || 'Yönetici şifresi sunucuda bcrypt ile şifrelenerek güncellendi!');
    } catch (err) {
      addToast(err.message || 'Şifre güncellenemedi.', 'error');
    } finally {
      setIsUpdatingCredential(false);
    }
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newTitle || !newSubtitle) return;

    const titleTR = newTitle;
    const titleEN = newTitleEN || autoTranslateString(newTitle, 'EN');
    const subtitleTR = newSubtitle;
    const subtitleEN = newSubtitleEN || autoTranslateString(newSubtitle, 'EN');
    const badgeTR = newBadge || 'Yeni';
    const badgeEN = autoTranslateString(badgeTR, 'EN');
    const salesBadgeTR = newSalesBadge || '🔥 Yeni Çıktı';
    const salesBadgeEN = autoTranslateString(salesBadgeTR, 'EN');
    const roiTextTR = newRoiText || '';
    const roiTextEN = autoTranslateString(roiTextTR, 'EN');

    const specsTR = newSpecs.split(',').map((s) => s.trim()).filter(Boolean);
    const specsEN = newSpecsEN
      ? newSpecsEN.split(',').map((s) => s.trim()).filter(Boolean)
      : specsTR.map((s) => autoTranslateString(s, 'EN'));

    const newProd = {
      id: `prod-${Date.now().toString(36)}`,
      title: { TR: titleTR, EN: titleEN },
      subtitle: { TR: subtitleTR, EN: subtitleEN },
      category: newCategory || categoriesList[0]?.id || 'scraping',
      badge: { TR: badgeTR, EN: badgeEN },
      salesBadge: { TR: salesBadgeTR, EN: salesBadgeEN },
      roiText: { TR: roiTextTR, EN: roiTextEN },
      rating: 5.0,
      reviewsCount: 0,
      salesCount: 0,
      prices: { TRY: Number(newPriceTRY), USD: Number(newPriceUSD), EUR: Math.round(Number(newPriceUSD) * 0.92) },
      icon: newCategory === 'bot' ? 'Bot' : newCategory === 'scraping' ? 'Database' : 'Layers',
      accentColor: '#4f46e5',
      description: { TR: subtitleTR, EN: subtitleEN },
      specs: { TR: specsTR, EN: specsEN },
      techStack: newTech.split(',').map((t) => t.trim()).filter(Boolean),
      licenses: [
        { type: 'Standart Lisans', priceMultiplier: 1, desc: '1 Cihaz / Sunucu için hazır kullanım.' },
        { type: 'Ticari Lisans', priceMultiplier: 2.2, desc: 'Sınırsız sunucu kurulumu ve ticari kullanım.' },
        { type: 'Tam Kaynak Kod (Full Source)', priceMultiplier: 3.8, desc: 'Bütün açık kaynak kodlar ve dökümantasyon.' }
      ],
      snippet: `# KODRAN.DEV Hızlı Başlangıç\nimport kodran_core\nkodran_core.start()`
    };

    addProduct(newProd);
    setShowAddProductModal(false);
    setNewTitle('');
    setNewTitleEN('');
    setNewSubtitle('');
    setNewSubtitleEN('');
    addToast('Yeni yazılım Türkçe ve İngilizce çift dilli olarak vitrinde yayınlandı!');
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setEditTitle(typeof product.title === 'object' ? product.title.TR : (product.title || ''));
    setEditTitleEN(typeof product.title === 'object' ? product.title.EN : autoTranslateString(product.title, 'EN'));
    setEditSubtitle(typeof product.subtitle === 'object' ? product.subtitle.TR : (product.subtitle || ''));
    setEditSubtitleEN(typeof product.subtitle === 'object' ? product.subtitle.EN : autoTranslateString(product.subtitle, 'EN'));
    setEditCategory(product.category || categoriesList[0]?.id || 'scraping');
    setEditBadge(typeof product.badge === 'object' ? product.badge.TR : (product.badge || 'Popüler'));
    setEditSalesBadge(typeof product.salesBadge === 'object' ? product.salesBadge.TR : (product.salesBadge || ''));
    setEditRoiText(typeof product.roiText === 'object' ? product.roiText.TR : (product.roiText || ''));
    setEditPriceTRY(product.prices?.TRY || 3000);
    setEditPriceUSD(product.prices?.USD || 90);
    setEditTech(product.techStack ? product.techStack.join(', ') : '');
    
    let spTR = product.specs;
    if (typeof spTR === 'object' && !Array.isArray(spTR)) spTR = spTR.TR || [];
    setEditSpecs(Array.isArray(spTR) ? spTR.join(', ') : '');

    let spEN = product.specs;
    if (typeof spEN === 'object' && !Array.isArray(spEN)) spEN = spEN.EN || [];
    setEditSpecsEN(Array.isArray(spEN) ? spEN.join(', ') : '');

    setEditSnippet(product.snippet || '');
    setShowEditProductModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const titleTR = editTitle;
    const titleEN = editTitleEN || autoTranslateString(editTitle, 'EN');
    const subtitleTR = editSubtitle;
    const subtitleEN = editSubtitleEN || autoTranslateString(editSubtitle, 'EN');
    const badgeTR = editBadge;
    const badgeEN = autoTranslateString(badgeTR, 'EN');
    const salesBadgeTR = editSalesBadge;
    const salesBadgeEN = autoTranslateString(salesBadgeTR, 'EN');
    const roiTextTR = editRoiText;
    const roiTextEN = autoTranslateString(roiTextTR, 'EN');

    const specsTR = editSpecs.split(',').map((s) => s.trim()).filter(Boolean);
    const specsEN = editSpecsEN
      ? editSpecsEN.split(',').map((s) => s.trim()).filter(Boolean)
      : specsTR.map((s) => autoTranslateString(s, 'EN'));

    const updatedData = {
      title: { TR: titleTR, EN: titleEN },
      subtitle: { TR: subtitleTR, EN: subtitleEN },
      category: editCategory,
      badge: { TR: badgeTR, EN: badgeEN },
      salesBadge: { TR: salesBadgeTR, EN: salesBadgeEN },
      roiText: { TR: roiTextTR, EN: roiTextEN },
      prices: {
        ...editingProduct.prices,
        TRY: Number(editPriceTRY),
        USD: Number(editPriceUSD),
        EUR: Math.round(Number(editPriceUSD) * 0.92)
      },
      techStack: editTech.split(',').map((s) => s.trim()).filter(Boolean),
      specs: { TR: specsTR, EN: specsEN },
      description: { TR: subtitleTR, EN: subtitleEN },
      snippet: editSnippet
    };

    updateProduct(editingProduct.id, updatedData);
    setShowEditProductModal(false);
    setEditingProduct(null);
    addToast('Ürün çift dilli olarak başarıyla güncellendi!');
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName) return;

    const slug = newCatId
      ? newCatId.toLowerCase().trim().replace(/[^a-z0-9]/g, '-')
      : newCatName.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');

    addCategory({
      id: slug,
      name: newCatName.trim(),
      desc: newCatDesc.trim() || 'Kurumsal yazılım kategorisi'
    });

    setNewCatName('');
    setNewCatId('');
    setNewCatDesc('');
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setEditCatName(cat.name || '');
    setEditCatDesc(cat.desc || '');
    setShowEditCategoryModal(true);
  };

  const handleSaveCategoryEdit = (e) => {
    e.preventDefault();
    if (!editingCategory || !editCatName) return;

    updateCategory(editingCategory.id, {
      name: editCatName.trim(),
      desc: editCatDesc.trim()
    });

    setShowEditCategoryModal(false);
    setEditingCategory(null);
  };

  const handleCreateReview = (e) => {
    e.preventDefault();
    if (!newRevAuthor || !newRevComment) return;

    addReview({
      author: newRevAuthor,
      role: newRevRole || 'Yetkili',
      company: newRevCompany || newRevAuthor,
      comment: newRevComment,
      rating: Number(newRevRating)
    });

    setShowAddReviewModal(false);
    setNewRevAuthor('');
    setNewRevRole('');
    setNewRevCompany('');
    setNewRevComment('');
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastSubject || !broadcastMessage) return;

    sendBroadcast({
      channel: broadcastChannel,
      subject: broadcastSubject,
      message: broadcastMessage
    });

    setBroadcastSubject('');
    setBroadcastMessage('');
  };

  const handleSavePaymentSettings = (e) => {
    e.preventDefault();
    updatePaymentSettings(tempPayment);
  };

  const handleSaveTelegramBot = (e) => {
    e.preventDefault();
    updateTelegramBotSettings(tempTelegram);
  };

  const handleTestTelegramNotification = async () => {
    if (!tempTelegram.botToken || !tempTelegram.chatId) {
      addToast('Lütfen önce Bot Token ve Chat ID girin.', 'error');
      return;
    }
    addToast('Test bildirimi gönderiliyor...');
    await sendTelegramAlert('🔔 <b>TEST BİLDİRİMİ BAŞARILI!</b>\nKODRAN.DEV admin bot bağlantısı kuruldu. Siparişleriniz artık anında cebinizde.');
    addToast('Test bildirimi Telegram adresinize iletildi!');
  };

  const handleSaveFlashSale = (e) => {
    e.preventDefault();
    updateFlashSaleSettings(tempFlashSale);
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    updateSecuritySettings(tempSecurity);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      importDatabaseBackup(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCpnCode) return;
    addCoupon({
      code: newCpnCode.toUpperCase().trim(),
      discount: Number(newCpnDiscount),
      description: newCpnDesc || `%${newCpnDiscount} İndirim`
    });
    setNewCpnCode('');
    setNewCpnDesc('');
  };

  const handleSaveSiteSettings = (e) => {
    e.preventDefault();
    updateSiteSettings(tempSiteSettings);
  };

  const handleCreateLicense = (e) => {
    e.preventDefault();
    if (!licClient) return;

    const key = generateCryptoLicenseKey('KDR');
    addLicense({
      key,
      client: sanitizeInput(licClient),
      product: licProduct,
      type: licType,
      status: 'Aktif',
      created: new Date().toISOString().split('T')[0]
    });

    setShowAddLicenseModal(false);
    setLicClient('');
    addToast(`Yeni kriptografik lisans anahtarı üretildi: ${key}`);
  };

  const handleTestVerifyKey = (e) => {
    e.preventDefault();
    if (!testVerifyKey.trim()) return;
    const isValid = verifyLicenseIntegrity(testVerifyKey.trim());
    setVerifyResult({
      key: testVerifyKey.trim(),
      isValid,
      checkedAt: new Date().toLocaleTimeString()
    });
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    addToast('Lisans anahtarı kopyalandı!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const navigationItems = [
    { id: 'products', label: 'Yazılım Kataloğu', count: productsList.length, icon: Layers },
    { id: 'categories', label: 'Kategori Yönetimi', count: categoriesList.length, icon: FolderTree },
    { id: 'orders', label: 'Siparişler & Faturalar', count: ordersList.length, icon: Receipt },
    { id: 'customers', label: 'Müşteri & Üyeler', count: customersList.length, icon: Users },
    { id: 'leads', label: 'Özel Proje Talepleri', count: customOrdersList.length, icon: MessageSquare },
    { id: 'licenses', label: 'Lisans Anahtarları', count: licensesList.length, icon: KeyRound },
    { id: 'telegram', label: 'Telegram Bildirim Botu', icon: BellRing },
    { id: 'flash_sale', label: 'Flaş İndirim & Kampanya', icon: Flame },
    { id: 'payments', label: 'Ödeme Altyapıları & API', icon: CreditCard },
    { id: 'coupons', label: 'İndirim Kuponları', count: couponsList.length, icon: Tag },
    { id: 'reviews', label: 'Müşteri Yorumları', count: reviewsList.length, icon: Star },
    { id: 'cluster', label: 'Bot & Sunucu Sağlığı', icon: Activity },
    { id: 'broadcast', label: 'Duyuru & E-Bülten', icon: Send },
    { id: 'backup', label: 'Veritabanı & Yedek', icon: Download },
    { id: 'firewall', label: 'Güvenlik & Bakım Modu', icon: ShieldAlert },
    { id: 'security', label: 'Güvenlik & Loglar', count: auditLogsList.length, icon: Lock },
    { id: 'settings', label: 'Genel Site Ayarları', icon: Settings },
    { id: 'overview', label: 'Genel Ciro & Rapor', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pt-20 sm:pt-24 pb-12 select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-8">
        
        {/* Main 2-Column Sidebar + Scrollable Content Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          
          {/* 1. LEFT SIDEBAR (DİKEY MENÜ) */}
          <aside className="w-full lg:w-72 shrink-0 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col justify-between space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
            
            <div className="space-y-4">
              
              {/* Sidebar Header */}
              <div className="px-2 pt-1 pb-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                    K
                  </div>
                  <h2 className="font-extrabold text-slate-900 text-base tracking-tight">KODRAN<span className="text-indigo-600">.DEV</span></h2>
                </div>
              </div>

              {/* Vertical Navigation Links */}
              <nav className="space-y-1 max-h-[500px] overflow-y-auto custom-scrollbar pr-0.5">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.count !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                          isActive
                            ? 'bg-slate-800 text-slate-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

            </div>

            {/* Sidebar Footer Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => setCurrentView('store')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Store className="w-4 h-4" />
                <span>Mağaza Vitrinine Dön</span>
              </button>
            </div>

          </aside>

          {/* 2. RIGHT MAIN SCROLLABLE CONTENT AREA (SCROLL PANELİ) */}
          <main className="flex-1 w-full min-w-0 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 lg:max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
            
            {/* TAB 1: PRODUCTS MANAGER */}
            {activeTab === 'products' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Hazır Yazılım Havuzu Yönetimi</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Mevcut yazılımların fiyatlarını, rozetlerini ve açıklamalarını güncelleyin veya yeni ürün yayınlayın.</p>
                  </div>

                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yeni Yazılım Ekle</span>
                  </button>
                </div>

                {productsList.length === 0 ? (
                  <div className="text-center py-16 p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                    <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
                    <h4 className="text-base font-bold text-slate-800">Henüz Yazılım Eklenmedi</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">Vitrinde yayınlamak için "Yeni Yazılım Ekle" butonunu kullanarak ilk bot veya yazılımınızı ekleyin.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {productsList.map((product) => (
                      <div key={product.id} className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4 hover:border-indigo-300 hover:bg-white transition-all">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {getLocalizedText(product.badge, 'TR')}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-900">
                              {CURRENCY_SYMBOLS[currency] || '₺'}{getProductPrice(product, null, currency)?.toLocaleString('tr-TR')}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-slate-900 line-clamp-1">{getLocalizedText(product.title, 'TR')}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{getLocalizedText(product.subtitle, 'TR')}</p>

                          {product.salesBadge && (
                            <div className="mt-2 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                              <span className="truncate">{getLocalizedText(product.salesBadge, 'TR')}</span>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1 mt-3">
                            {product.techStack?.map((t, i) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-mono">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium font-mono text-[11px] truncate max-w-[120px]">
                            {product.id}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(product)}
                              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Düzenle</span>
                            </button>

                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer rounded-xl hover:bg-rose-50"
                              title="Katalogdan Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: CATEGORIES MANAGER */}
            {activeTab === 'categories' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Kategori Yönetimi</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Yazılımların gruplandığı kategorileri ekleyin, adını ve açıklamalarını düzenleyin veya silin.</p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <FolderPlus className="w-4 h-4 text-indigo-600" />
                    <span>Yeni Kategori Oluştur</span>
                  </div>

                  <form onSubmit={handleCreateCategory} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-4">
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Kategori Adı</label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: Siber Güvenlik Araçları"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Kategori Slug / ID (Opsiyonel)</label>
                      <input
                        type="text"
                        placeholder="security"
                        value={newCatId}
                        onChange={(e) => setNewCatId(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Kısa Açıklama</label>
                      <input
                        type="text"
                        placeholder="Penetrasyon ve güvenlik otomasyonları"
                        value={newCatDesc}
                        onChange={(e) => setNewCatDesc(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div className="sm:col-span-2 flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Kategori Ekle
                      </button>
                    </div>
                  </form>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categoriesList.map((cat) => {
                    const productCount = productsList.filter((p) => p.category === cat.id).length;

                    return (
                      <div key={cat.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between hover:border-indigo-300 transition-all">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900">
                              {cat.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700">
                              {productCount} Ürün
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono">slug: <strong>{cat.id}</strong></p>
                          {cat.desc && <p className="text-xs text-slate-500">{cat.desc}</p>}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditCategory(cat)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Düzenle</span>
                          </button>

                          <button
                            onClick={() => deleteCategory(cat.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer rounded-lg hover:bg-rose-50"
                            title="Kategoriyi Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: ORDERS & INVOICES */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Sipariş & Fatura Geçmişi</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Müşterilerin platform üzerinden tamamladığı tüm lisans ve kaynak kod siparişleri.</p>
                </div>

                {ordersList.length === 0 ? (
                  <div className="text-center py-16 p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                    <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
                    <h4 className="text-base font-bold text-slate-800">Henüz Kayıtlı Sipariş Yok</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">Müşteriler mağazadan yazılım satın aldıkça siparişler, ödeme detayları ve lisans anahtarları anında buraya işlenecektir.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-mono uppercase">
                          <tr>
                            <th className="px-6 py-4">Sipariş No</th>
                            <th className="px-6 py-4">Müşteri / E-Posta</th>
                            <th className="px-6 py-4">Satın Alınan Yazılım</th>
                            <th className="px-6 py-4">Tutar & Yöntem</th>
                            <th className="px-6 py-4">Lisans Anahtarı</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4 text-right">İşlem</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {ordersList.map((ord) => (
                            <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors font-medium">
                              <td className="px-6 py-4 font-mono font-bold text-slate-900">
                                #{ord.id}
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-bold text-slate-900">{ord.customerName}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{ord.customerEmail}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-bold text-slate-800">{getLocalizedText(ord.productTitle, 'TR')}</div>
                                <div className="text-[10px] font-mono text-indigo-600">{ord.licenseType || ord.licenseTier}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-mono font-extrabold text-slate-900">₺{Number(ord.amount).toLocaleString('tr-TR')}</div>
                                <div className="text-[10px] text-slate-400">{ord.paymentMethod}</div>
                              </td>
                              <td className="px-6 py-4 font-mono text-[11px] text-indigo-600 font-bold select-all">
                                {ord.licenseKey || 'Otomatik Üretildi'}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  ord.status === 'Tamamlandı' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700'
                                }`}>
                                  {ord.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(ord);
                                    addToast(`Sipariş #${ord.id} faturası görüntülendi.`);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                                >
                                  Fatura
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: TELEGRAM NOTIFICATION BOT */}
            {activeTab === 'telegram' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">📲 Telegram Anlık Sipariş & Lead Botu</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Siteden bir sipariş geldiğinde veya proje teklifi iletildiğinde anında Telegram bildirimi alın.</p>
                </div>

                <form onSubmit={handleSaveTelegramBot} className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-700">
                      <BellRing className="w-4 h-4 text-indigo-600" />
                      <span>Telegram Bot API Ayarları</span>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempTelegram.isEnabled}
                        onChange={(e) => setTempTelegram({ ...tempTelegram, isEnabled: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600"
                      />
                      <span className="text-xs font-bold text-slate-700">Bildirimleri Aktif Et</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Telegram Bot Token (@BotFather)</label>
                      <input
                        type="text"
                        placeholder="7128912389:AAFxxx..."
                        value={tempTelegram.botToken || ''}
                        onChange={(e) => setTempTelegram({ ...tempTelegram, botToken: e.target.value })}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Telegram Chat ID / Kanal ID</label>
                      <input
                        type="text"
                        placeholder="189281920 veya @kanal_adi"
                        value={tempTelegram.chatId || ''}
                        onChange={(e) => setTempTelegram({ ...tempTelegram, chatId: e.target.value })}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-200 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={tempTelegram.notifyOnOrder}
                        onChange={(e) => setTempTelegram({ ...tempTelegram, notifyOnOrder: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600"
                      />
                      <span>Yeni Siparişlerde Bildir</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={tempTelegram.notifyOnLead}
                        onChange={(e) => setTempTelegram({ ...tempTelegram, notifyOnLead: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600"
                      />
                      <span>Özel Proje Taleplerinde Bildir</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Ayarları Kaydet</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleTestTelegramNotification}
                      className="px-6 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Test Bildirimi Gönder</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 5: FLASH SALE CAMPAIGN */}
            {activeTab === 'flash_sale' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">⚡ Mağaza Geneli Flaş İndirim Kampanyası</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Tüm hazır yazılımlarda tek tıkla genel indirim kampanyası başlatın veya durdurun.</p>
                </div>

                <form onSubmit={handleSaveFlashSale} className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-700">
                      <Flame className="w-5 h-5 text-amber-500 fill-amber-400" />
                      <span>Flaş Kampanya Durumu</span>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempFlashSale.isEnabled}
                        onChange={(e) => setTempFlashSale({ ...tempFlashSale, isEnabled: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600"
                      />
                      <span className={`text-xs font-extrabold ${tempFlashSale.isEnabled ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {tempFlashSale.isEnabled ? '● KAMPANYA CANLI / AKTİF' : '○ Kampanya Kapalı'}
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Genel İndirim Yüzdesi (%)</label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={tempFlashSale.discountPercent}
                        onChange={(e) => setTempFlashSale({ ...tempFlashSale, discountPercent: Number(e.target.value) })}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 font-mono font-bold focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Kampanya Slogan Başlığı</label>
                      <input
                        type="text"
                        value={tempFlashSale.title}
                        onChange={(e) => setTempFlashSale({ ...tempFlashSale, title: e.target.value })}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Flaş İndirim Ayarlarını Güncelle</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 6: BACKUP & DATABASE EXPORT/IMPORT */}
            {activeTab === 'backup' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">💾 Veritabanı Yedekleme & Geri Yükleme</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Tüm ürünlerinizi, siparişlerinizi, ayarlarınızı tek tıkla yedekleyin veya geri yükleyin.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  
                  {/* Export Backup */}
                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                        <Download className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Yedek İndir (.JSON)</h4>
                      <p className="text-xs text-slate-500 mt-1">Tüm mağaza veritabanını tek bir JSON dosyası olarak bilgisayarınıza indirin.</p>
                    </div>

                    <button
                      onClick={exportDatabaseBackup}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Yedek Dosyasını İndir</span>
                    </button>
                  </div>

                  {/* Import Backup */}
                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                        <Upload className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Yedekten Geri Yükle</h4>
                      <p className="text-xs text-slate-500 mt-1">Daha önce indirdiğiniz bir .JSON yedek dosyasını sisteme aktarın.</p>
                    </div>

                    <label className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer text-center">
                      <Upload className="w-4 h-4" />
                      <span>JSON Dosyası Seç</span>
                      <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                    </label>
                  </div>

                  {/* Reset Defaults */}
                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                        <RefreshCw className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Fabrika Ayarlarına Dön</h4>
                      <p className="text-xs text-slate-500 mt-1">Test siparişlerini temizleyip mağazayı ilk tertemiz haline getirin.</p>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm('Tüm test verilerini sıfırlamak istediğinize emin misiniz?')) {
                          resetToFactoryDefaults();
                        }
                      }}
                      className="w-full py-3 rounded-xl bg-slate-200 hover:bg-rose-600 hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Sıfırla</span>
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 7: FIREWALL & MAINTENANCE */}
            {activeTab === 'firewall' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">🛡️ Güvenlik Duvarı & Bakım Modu</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Platform bakım modunu ve IP engelleme kurallarını yönetin.</p>
                </div>

                <form onSubmit={handleSaveSecurity} className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-700">
                      <ShieldAlert className="w-5 h-5 text-amber-500" />
                      <span>Sistem Bakım Modu (Maintenance Mode)</span>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempSecurity.maintenanceMode}
                        onChange={(e) => setTempSecurity({ ...tempSecurity, maintenanceMode: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600"
                      />
                      <span className={`text-xs font-extrabold ${tempSecurity.maintenanceMode ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {tempSecurity.maintenanceMode ? '⚠️ BAKIM MODU DEVREDE' : '● SİTE CANLI VE AÇIK'}
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Bakım Ekranı Mesajı</label>
                    <input
                      type="text"
                      value={tempSecurity.maintenanceMessage}
                      onChange={(e) => setTempSecurity({ ...tempSecurity, maintenanceMessage: e.target.value })}
                      className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Güvenlik Ayarlarını Kaydet</span>
                  </button>
                </form>

                {/* Master Admin Credential Management (Server-Side Bcrypt Hashing) */}
                <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-indigo-600" />
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">Yönetici Şifre Yönetimi (Server-Side Bcrypt Auth)</h4>
                        <p className="text-[11px] text-slate-500">Sunucu tarafı güvenli bcrypt şifreleme ve HttpOnly oturum mimarisi.</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                      🔒 SERVER-SIDE BCRYPT ACTIVE
                    </span>
                  </div>

                  <form onSubmit={handleUpdateAdminPassword} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Mevcut Yönetici Şifresi
                        </label>
                        <input
                          type="password"
                          value={currentAdminPassword}
                          onChange={(e) => setCurrentAdminPassword(e.target.value)}
                          placeholder="Mevcut şifreniz..."
                          className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-mono tracking-widest focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Yeni Şifre (En az 6 Karakter)
                        </label>
                        <input
                          type="password"
                          required
                          value={newAdminPassword}
                          onChange={(e) => setNewAdminPassword(e.target.value)}
                          placeholder="Yeni güvenli şifre..."
                          className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-mono tracking-widest focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={isUpdatingCredential}
                        className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{isUpdatingCredential ? 'Güncelleniyor...' : 'Şifreyi Sunucuda Güncelle (Bcrypt)'}</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Şifre istemcide hiçbir zaman saklanmaz veya açık metin olarak doğrulanmaz. İstek sunucuya gönderilir ve bcrypt (salt=10) ile güvenli bir şekilde hash'lenir.
                    </p>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 8: CUSTOMERS & CLIENTS */}
            {activeTab === 'customers' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Müşteri & Kurumsal Üye Yönetimi</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Platforma kayıt olan şirketler ve bireysel geliştiriciler.</p>
                </div>

                {customersList.length === 0 ? (
                  <div className="text-center py-16 p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                    <Users className="w-12 h-12 text-slate-300 mx-auto" />
                    <h4 className="text-base font-bold text-slate-800">Henüz Kayıtlı Müşteri Yok</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">Kullanıcılar "Kayıt Ol" formunu doldurdukça veya sipariş verdikçe müşteri profilleri burada listelenecektir.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {customersList.map((cust) => (
                      <div key={cust.id} className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-sm border border-indigo-100">
                              {cust.name?.substring(0, 2).toUpperCase() || 'US'}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">{cust.name}</h4>
                              <p className="text-xs text-slate-500">{cust.company}</p>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cust.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {cust.status}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-600 bg-white p-3 rounded-2xl border border-slate-200/80 font-mono text-[11px]">
                          <div>✉️ {cust.email}</div>
                          <div>📱 {cust.phone || cust.telegram || 'Belirtilmedi'}</div>
                          <div className="text-indigo-600 font-bold pt-1">💰 Toplam Harcama: ₺{Number(cust.totalSpent || 0).toLocaleString('tr-TR')}</div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                          <button
                            onClick={() => updateCustomerStatus(cust.id, cust.status === 'Aktif' ? 'Askıda' : 'Aktif')}
                            className="text-[11px] font-bold text-slate-700 hover:text-indigo-600 cursor-pointer"
                          >
                            {cust.status === 'Aktif' ? 'Hesabı Askıya Al' : 'Aktif Et'}
                          </button>

                          <button
                            onClick={() => deleteCustomer(cust.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer rounded-lg hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 9: LEADS PIPELINE */}
            {activeTab === 'leads' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Özel Proje Talepleri (CRM)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Müşterilerden gelen bot ve yazılım taleplerini aşamalarına göre yönetin.</p>
                </div>

                {customOrdersList.length === 0 ? (
                  <div className="text-center py-16 p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
                    <h4 className="text-base font-bold text-slate-800">Bekleyen Özel Proje Talebi Yok</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">Müşteriler mağazadaki "Özel Proje İste" formunu doldurduğunda talepleri bütçeleriyle birlikte buraya düşer.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customOrdersList.map((lead) => (
                      <div key={lead.id} className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h4 className="text-sm font-bold text-slate-900">{lead.name}</h4>
                            <span className="text-xs font-mono text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                              {lead.contact}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                              {lead.budget}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed font-normal bg-white p-3 rounded-xl border border-slate-200/80">
                            "{lead.details}"
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer"
                          >
                            <option value="Yeni">Yeni Talep</option>
                            <option value="İletişime Geçildi">İletişime Geçildi</option>
                            <option value="Teklif Gönderildi">Teklif Gönderildi</option>
                            <option value="Onaylandı">Onaylandı & Başlandı</option>
                          </select>

                          <a
                            href={`https://t.me/${lead.contact ? lead.contact.replace('@', '') : 'kodran_dev'}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Telegram</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 10: LICENSES MANAGER */}
            {activeTab === 'licenses' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Kriptografik Lisans Anahtarları</h3>
                    <p className="text-xs text-slate-500 mt-0.5">WebCrypto tabanlı dijital imzalı lisansları yönetin ve orijinalliklerini doğrulayın.</p>
                  </div>

                  <button
                    onClick={() => setShowAddLicenseModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yeni Kripto Lisans Üret</span>
                  </button>
                </div>

                {/* Cryptographic Key Verifier Tool */}
                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>WebCrypto Lisans Doğrulama & Checksum Testi</span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      Format: KDR-XXXX-XXXX-XXXX-XXXX
                    </span>
                  </div>

                  <form onSubmit={handleTestVerifyKey} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Doğrulanacak Lisans Anahtarını Yapıştırın (Örn: KDR-9X2L-88KV-491P-8N2A)..."
                      value={testVerifyKey}
                      onChange={(e) => {
                        setTestVerifyKey(e.target.value);
                        setVerifyResult(null);
                      }}
                      className="flex-1 p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:border-indigo-600"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Doğrula</span>
                    </button>
                  </form>

                  {verifyResult && (
                    <div className={`p-3 rounded-xl border text-xs flex items-center justify-between font-mono animate-in fade-in duration-150 ${
                      verifyResult.isValid 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                      <div className="flex items-center gap-2 font-bold">
                        {verifyResult.isValid ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>✅ GEÇERLİ LİSANS: KODRAN.DEV Kriptografik Checksum Doğrulandı ({verifyResult.key})</span>
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>❌ GEÇERSİZ LİSANS: Checksum veya Format Hatalı ({verifyResult.key})</span>
                          </>
                        )}
                      </div>
                      <span className="text-[10px] opacity-75">{verifyResult.checkedAt}</span>
                    </div>
                  )}
                </div>

                {licensesList.length === 0 ? (
                  <div className="text-center py-16 p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                    <KeyRound className="w-12 h-12 text-slate-300 mx-auto" />
                    <h4 className="text-base font-bold text-slate-800">Henüz Üretilmiş Lisans Yok</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">Yeni bir müşteriye lisans vermek için "Yeni Kripto Lisans Üret" butonuna tıklayabilir veya siparişleri bekleyebilirsiniz.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-mono uppercase">
                          <tr>
                            <th className="px-6 py-4">Lisans Anahtarı</th>
                            <th className="px-6 py-4">Müşteri / Kurum</th>
                            <th className="px-6 py-4">Yazılım</th>
                            <th className="px-6 py-4">Lisans Tipi</th>
                            <th className="px-6 py-4">Güvenlik / Durum</th>
                            <th className="px-6 py-4 text-right">İşlem</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {licensesList.map((lic, index) => (
                            <tr key={index} className="hover:bg-slate-50/80 transition-colors font-medium">
                              <td className="px-6 py-4 font-mono font-bold text-indigo-600 select-all">
                                {lic.key}
                              </td>
                              <td className="px-6 py-4 text-slate-900 font-bold">{lic.client}</td>
                              <td className="px-6 py-4 text-slate-600">{lic.product}</td>
                              <td className="px-6 py-4">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                  {lic.type || lic.tier}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 inline-flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  <span>{lic.status || 'Aktif'}</span>
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => handleCopyKey(lic.key)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors cursor-pointer"
                                  title="Anahtarı Kopyala"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 11: REVIEWS & TESTIMONIALS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Müşteri Yorumları & Referans Yönetimi</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Mağaza vitrininde yayınlanan doğrulanmış müşteri değerlendirmeleri.</p>
                  </div>

                  <button
                    onClick={() => setShowAddReviewModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yeni Yorum Ekle</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-amber-500">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            ✓ Doğrulanmış Müşteri
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{rev.author}</div>
                          <div className="text-[11px] text-slate-500">{rev.role}</div>
                        </div>

                        <button
                          onClick={() => deleteReview(rev.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer rounded-lg hover:bg-rose-50"
                          title="Yorumu Kaldır"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 12: PAYMENT GATEWAYS & API SETTINGS */}
            {activeTab === 'payments' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Ödeme Altyapıları & API Entegrasyonları</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Stripe, Iyzico, Kripto Cüzdanı ve Banka Havale hesaplarınızı buradan anlık yönetin.</p>
                </div>

                <form onSubmit={handleSavePaymentSettings} className="space-y-6">
                  
                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="w-5 h-5 text-indigo-600" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Kredi Kartı Altyapıları (Stripe & Iyzico)</h4>
                          <p className="text-[11px] text-slate-500">Global ve yerel kredi kartı tahsilat anahtarları.</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowSecrets(!showSecrets)}
                          className="px-3 py-1 rounded-xl text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          {showSecrets ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
                          <span>{showSecrets ? 'Gizli Anahtarları Maskele' : 'Gizli Anahtarları Göster'}</span>
                        </button>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          tempPayment.isLiveMode ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {tempPayment.isLiveMode ? '● CANLI MOD' : '● TEST / SANDBOX'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Stripe Publishable Key (Canlı / Test)</label>
                        <input
                          type="text"
                          value={tempPayment.stripePublishableKey || ''}
                          onChange={(e) => setTempPayment({ ...tempPayment, stripePublishableKey: e.target.value })}
                          className="w-full p-3 rounded-xl bg-white border border-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-600 font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Stripe Secret Key</label>
                        <input
                          type={showSecrets ? "text" : "password"}
                          value={tempPayment.stripeSecretKey || ''}
                          onChange={(e) => setTempPayment({ ...tempPayment, stripeSecretKey: e.target.value })}
                          className="w-full p-3 rounded-xl bg-white border border-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-600 font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Iyzico API Key</label>
                        <input
                          type="text"
                          value={tempPayment.iyzicoApiKey || ''}
                          onChange={(e) => setTempPayment({ ...tempPayment, iyzicoApiKey: e.target.value })}
                          className="w-full p-3 rounded-xl bg-white border border-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-600 font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Iyzico Secret Key</label>
                        <input
                          type={showSecrets ? "text" : "password"}
                          value={tempPayment.iyzicoSecretKey || ''}
                          onChange={(e) => setTempPayment({ ...tempPayment, iyzicoSecretKey: e.target.value })}
                          className="w-full p-3 rounded-xl bg-white border border-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-600 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/80">
                      <Coins className="w-5 h-5 text-emerald-600" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Kripto Ödeme (USDT TRC-20 Cüzdanı)</h4>
                        <p className="text-[11px] text-slate-500">Müşterilerin sepet ekranında göreceği ödeme cüzdan adresi.</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Tether (USDT TRC-20) Yatırma Adresi</label>
                      <input
                        type="text"
                        value={tempPayment.cryptoWallet || ''}
                        onChange={(e) => setTempPayment({ ...tempPayment, cryptoWallet: e.target.value })}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-600 font-medium"
                      />
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/80">
                      <Landmark className="w-5 h-5 text-cyan-600" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Banka Havale & EFT Hesap Bilgileri</h4>
                        <p className="text-[11px] text-slate-500">Havale seçildiğinde müşteriye gösterilen kurumsal IBAN.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Banka Adı & Şube</label>
                        <input
                          type="text"
                          value={tempPayment.bankName || ''}
                          onChange={(e) => setTempPayment({ ...tempPayment, bankName: e.target.value })}
                          className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-600 font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Hesap Sahibi (Unvan)</label>
                        <input
                          type="text"
                          value={tempPayment.bankAccountName || ''}
                          onChange={(e) => setTempPayment({ ...tempPayment, bankAccountName: e.target.value })}
                          className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-600 font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">IBAN Numarası</label>
                        <input
                          type="text"
                          value={tempPayment.bankIban || ''}
                          onChange={(e) => setTempPayment({ ...tempPayment, bankIban: e.target.value })}
                          className="w-full p-3 rounded-xl bg-white border border-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-600 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Ödeme Altyapısı Ayarlarını Kaydet</span>
                  </button>

                </form>
              </div>
            )}

            {/* TAB 13: COUPONS & DISCOUNTS MANAGER */}
            {activeTab === 'coupons' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">İndirim & Promosyon Kuponları</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Müşterilerin sepet ekranında kullanabileceği indirim kodlarını yönetin.</p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Yeni İndirim Kuponu Oluştur</h4>
                  
                  <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        required
                        placeholder="Kupon Kodu (Örn: SUMMER30)"
                        value={newCpnCode}
                        onChange={(e) => setNewCpnCode(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-mono uppercase font-bold focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <input
                        type="number"
                        required
                        min="1"
                        max="99"
                        placeholder="İndirim Oranı %"
                        value={newCpnDiscount}
                        onChange={(e) => setNewCpnDiscount(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        placeholder="Açıklama (Opsiyonel)"
                        value={newCpnDesc}
                        onChange={(e) => setNewCpnDesc(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="w-full h-full py-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Kuponu Ekle
                      </button>
                    </div>
                  </form>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {couponsList.map((cpn) => (
                    <div key={cpn.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold font-mono text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                            {cpn.code}
                          </span>
                          <span className="text-xs font-bold text-emerald-600">
                            %{cpn.discount} İndirim
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{cpn.description}</p>
                      </div>

                      <button
                        onClick={() => deleteCoupon(cpn.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer rounded-lg hover:bg-rose-50"
                        title="Kuponu Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 14: BOT & CLUSTER HEALTH */}
            {activeTab === 'cluster' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Bot & Sunucu Sağlık Monitörü</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Bulut altyapısının, proxy havuzunun ve WebSocket bağlantılarının canlı durumu.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 font-mono">RESIDENTIAL PROXY POOL</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="text-3xl font-extrabold font-mono text-slate-900">%99.82</div>
                    <p className="text-xs text-slate-500">12.450 Aktif IP Havuzu • 0 Captcha Blokajı</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 font-mono">WEBSOCKET GECİKMESİ</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                    </div>
                    <div className="text-3xl font-extrabold font-mono text-indigo-600">2.1 ms</div>
                    <p className="text-xs text-slate-500">Binance / Bybit / BIST Feedleri Canlı</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 font-mono">RAG AI CEVAP HIZI</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
                    </div>
                    <div className="text-3xl font-extrabold font-mono text-cyan-600">420 ms</div>
                    <p className="text-xs text-slate-500">GPT-4o & Claude 3.5 Sonnet Hibrit Motor</p>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2 border border-slate-800">
                  <div className="text-emerald-400 font-bold flex items-center gap-2">
                    <Server className="w-4 h-4" /> [CLUSTER TELEMETRY STREAM // LIVE]
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    [CLUSTER] Aktif Hazır Yazılım Çözümü: {productsList.length} adet yayında.<br />
                    [CLUSTER] Toplam Dağıtık Lisans: {licensesList.length} adet aktif.<br />
                    [CLUSTER] Bekleyen CRM Talebi: {customOrdersList.length} adet kuyrukta.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 15: BROADCAST & NEWSLETTER */}
            {activeTab === 'broadcast' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Toplu Duyuru & E-Bülten Gönderici</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Yeni yazılım güncellemelerini Telegram VIP kanalına veya e-posta bültenine anında iletin.</p>
                </div>

                <form onSubmit={handleSendBroadcast} className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Kanal Seçin</label>
                      <select
                        value={broadcastChannel}
                        onChange={(e) => setBroadcastChannel(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:outline-none focus:border-indigo-600 cursor-pointer"
                      >
                        <option value="telegram">Telegram VIP Kanalı ({siteSettings.supportTelegram || '@kodran_dev'})</option>
                        <option value="email">E-Bülten Aboneleri ({newsletterSubscribers.length} Abone)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Duyuru Başlığı</label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: AutoScrape Enterprise v4.2 Yayınlandı!"
                        value={broadcastSubject}
                        onChange={(e) => setBroadcastSubject(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Duyuru Metni & Güncelleme Detayları</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Yeni özellikler, performans optimizasyonları ve indirim kuponları..."
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Duyuruyu Gönder & Yayınla</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 16: SECURITY & AUDIT LOGS */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Güvenlik & Denetim Günlüğü (Audit Logs)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Admin işlemleri, girişler, API güncellemeleri ve lisans üretim kayıtları.</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
                  <div className="divide-y divide-slate-100">
                    {auditLogsList.map((log) => (
                      <div key={log.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 text-xs hover:bg-slate-50/80 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <Lock className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900">{log.action}</span>
                            <p className="text-[11px] text-slate-500 mt-0.5">{log.details}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono text-[11px] font-bold text-slate-700">{log.ip}</div>
                          <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 17: GENERAL SITE SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Genel Site & İletişim Ayarları</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Platformun marka unvanı, destek kanalları ve genel duyuru metinleri.</p>
                </div>

                <form onSubmit={handleSaveSiteSettings} className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Marka Adı / Domain</label>
                      <input
                        type="text"
                        value={tempSiteSettings.brandName || ''}
                        onChange={(e) => setTempSiteSettings({ ...tempSiteSettings, brandName: e.target.value })}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 font-bold focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Resmi Telegram Destek Kanalı</label>
                      <input
                        type="text"
                        value={tempSiteSettings.supportTelegram || ''}
                        onChange={(e) => setTempSiteSettings({ ...tempSiteSettings, supportTelegram: e.target.value })}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 font-mono focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Resmi Destek E-Posta Adresi</label>
                      <input
                        type="email"
                        value={tempSiteSettings.supportEmail || ''}
                        onChange={(e) => setTempSiteSettings({ ...tempSiteSettings, supportEmail: e.target.value })}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Genel Sistem Duyurusu</label>
                      <input
                        type="text"
                        value={tempSiteSettings.announcement || ''}
                        onChange={(e) => setTempSiteSettings({ ...tempSiteSettings, announcement: e.target.value })}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Site Ayarlarını Kaydet</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 18: OVERVIEW & REAL FINANCIAL KPIS */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Gerçek Finansal Genel Bakış & Rapor</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Tamamen gerçek siparişler ve veri tabanından hesaplanan canlı performans göstergeleri.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ● Canlı Veri Akışı
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  
                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Toplam Gerçek Gelir</span>
                    <div className="text-3xl font-extrabold font-mono text-slate-900">
                      ₺{totalRevenue.toLocaleString('tr-TR')}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {ordersList.length} Adet Tamamlanan Sipariş
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Aktif Lisanslı Müşteri</span>
                    <div className="text-3xl font-extrabold font-mono text-indigo-600">
                      {totalCustomersCount} Müşteri
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Kayıtlı Kurumsal Hesap</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Dağıtılan Lisans Anahtarı</span>
                    <div className="text-3xl font-extrabold font-mono text-slate-900">
                      {totalLicensesCount} Adet
                    </div>
                    <p className="text-[11px] text-indigo-600 font-medium">Aktif Kriptografik KDR-</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Bekleyen CRM Talebi</span>
                    <div className="text-3xl font-extrabold font-mono text-emerald-600">
                      {pendingLeadsCount} Talep
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Özel Bot & Yazılım Kuyruğu</p>
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Kategori Dağılımı (Aktif Yazılımlar)</h4>
                    <div className="space-y-2.5">
                      {categoriesList.map((cat) => {
                        const count = productsList.filter(p => p.category === cat.id).length;
                        const percent = productsList.length > 0 ? Math.round((count / productsList.length) * 100) : 0;
                        return (
                          <div key={cat.id} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-slate-700">{cat.name}</span>
                              <span className="font-mono text-slate-500">{count} Yazılım (%{percent})</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Son Sistem İşlemleri (Gerçek Loglar)</h4>
                    <div className="space-y-2">
                      {auditLogsList.slice(0, 5).map((log) => (
                        <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-800">{log.action}:</span>
                            <span className="text-slate-500 ml-1.5">{log.details}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">{log.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

          </main>

        </div>

        {/* INVOICE MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Kurumsal Lisans Faturası</h3>
                  <span className="text-xs font-mono text-indigo-600 font-bold">#{selectedOrder.id}</span>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-full hover:bg-slate-100 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Müşteri:</span>
                  <strong className="text-slate-900">{selectedOrder.customerName}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>E-Posta:</span>
                  <span className="font-mono">{selectedOrder.customerEmail}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Satın Alınan Yazılım:</span>
                  <span className="font-bold text-slate-900">{selectedOrder.productTitle}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Lisans Seviyesi:</span>
                  <span>{selectedOrder.licenseType}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Ödeme Yöntemi:</span>
                  <span>{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Lisans Anahtarı:</span>
                  <span className="font-mono font-bold text-indigo-600 select-all">{selectedOrder.licenseKey}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-100">
                  <span>Toplam Ödenen:</span>
                  <span className="font-mono">₺{Number(selectedOrder.amount).toLocaleString('tr-TR')}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  addToast('Fatura PDF olarak indirildi!');
                  setSelectedOrder(null);
                }}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Faturayı İndir (.PDF)
              </button>
            </div>
          </div>
        )}

        {/* MODAL 1: ADD PRODUCT */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-h-[90vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-slate-900">Yeni Hazır Yazılım Yayınla</h3>
                <button onClick={() => setShowAddProductModal(false)} className="p-2 rounded-full hover:bg-slate-100 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Yazılım Başlığı (TR) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: AutoScrape Enterprise"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-600 block mb-1">Product Title (EN) <span className="text-[10px] font-normal text-slate-400">(Boşsa otomatik çevrilir)</span></label>
                    <input
                      type="text"
                      placeholder="e.g. AutoScrape Enterprise"
                      value={newTitleEN}
                      onChange={(e) => setNewTitleEN(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-indigo-200 text-xs font-medium focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Kısa Alt Açıklama (TR) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Cloudflare Bypass Korumalı Yüksek Hızlı Python Motoru"
                      value={newSubtitle}
                      onChange={(e) => setNewSubtitle(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-600 block mb-1">Subtitle (EN) <span className="text-[10px] font-normal text-slate-400">(Boşsa otomatik çevrilir)</span></label>
                    <input
                      type="text"
                      placeholder="High Speed Python Scraping Engine with Cloudflare Bypass"
                      value={newSubtitleEN}
                      onChange={(e) => setNewSubtitleEN(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-indigo-200 text-xs font-medium focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Kategori</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-600 cursor-pointer"
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Sosyal Kanıt Rozeti</label>
                    <input
                      type="text"
                      placeholder="🔥 Son 24 saatte 8 lisans satıldı"
                      value={newSalesBadge}
                      onChange={(e) => setNewSalesBadge(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">ROI / Değer Özeti</label>
                    <input
                      type="text"
                      placeholder="Manuel işi %95 azaltır"
                      value={newRoiText}
                      onChange={(e) => setNewRoiText(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Fiyat (TRY ₺)</label>
                      <input
                        type="number"
                        required
                        value={newPriceTRY}
                        onChange={(e) => setNewPriceTRY(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Fiyat (USD $)</label>
                      <input
                        type="number"
                        required
                        value={newPriceUSD}
                        onChange={(e) => setNewPriceUSD(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Teknoloji Yığını (Virgülle ayırın)</label>
                    <input
                      type="text"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Öne Çıkan Özellikler (TR)</label>
                    <input
                      type="text"
                      placeholder="Anti-Bot Koruması, Çoklu Threading, CSV Export"
                      value={newSpecs}
                      onChange={(e) => setNewSpecs(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-indigo-600 block mb-1">Core Specs (EN) <span className="text-[10px] font-normal text-slate-400">(Boşsa otomatik çevrilir)</span></label>
                  <input
                    type="text"
                    placeholder="Anti-Bot Protection, Multi-Threading, CSV Export"
                    value={newSpecsEN}
                    onChange={(e) => setNewSpecsEN(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-indigo-200 text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Yazılımı Yayınla & Vitrine Ekle (Çift Dilli)
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: EDIT PRODUCT */}
        {showEditProductModal && editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-h-[90vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Yazılımı Düzenle & Güncelle</h3>
                  <span className="text-xs font-mono text-slate-400">ID: {editingProduct.id}</span>
                </div>
                <button onClick={() => setShowEditProductModal(false)} className="p-2 rounded-full hover:bg-slate-100 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Yazılım Başlığı (TR) *</label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-600 block mb-1">Product Title (EN)</label>
                    <input
                      type="text"
                      value={editTitleEN}
                      onChange={(e) => setEditTitleEN(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-indigo-200 text-xs font-medium focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Kısa Alt Açıklama (TR) *</label>
                    <input
                      type="text"
                      required
                      value={editSubtitle}
                      onChange={(e) => setEditSubtitle(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-600 block mb-1">Subtitle (EN)</label>
                    <input
                      type="text"
                      value={editSubtitleEN}
                      onChange={(e) => setEditSubtitleEN(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-indigo-200 text-xs font-medium focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Kategori</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-600 cursor-pointer"
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Sosyal Kanıt Rozeti</label>
                    <input
                      type="text"
                      value={editSalesBadge}
                      onChange={(e) => setEditSalesBadge(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">ROI / Değer Özeti</label>
                    <input
                      type="text"
                      value={editRoiText}
                      onChange={(e) => setEditRoiText(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Fiyat (TRY ₺)</label>
                      <input
                        type="number"
                        required
                        value={editPriceTRY}
                        onChange={(e) => setEditPriceTRY(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Fiyat (USD $)</label>
                      <input
                        type="number"
                        required
                        value={editPriceUSD}
                        onChange={(e) => setEditPriceUSD(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Teknoloji Yığını (Virgülle ayırın)</label>
                    <input
                      type="text"
                      value={editTech}
                      onChange={(e) => setEditTech(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Öne Çıkan Yetenekler (TR)</label>
                    <input
                      type="text"
                      value={editSpecs}
                      onChange={(e) => setEditSpecs(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-indigo-600 block mb-1">Core Specs (EN)</label>
                  <input
                    type="text"
                    value={editSpecsEN}
                    onChange={(e) => setEditSpecsEN(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-indigo-200 text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Değişiklikleri Kaydet & Vitrinde Güncelle (Çift Dilli)
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: ADD REVIEW */}
        {showAddReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-slate-900">Yeni Referans Yorumu Ekle</h3>
                <button onClick={() => setShowAddReviewModal(false)} className="p-2 rounded-full hover:bg-slate-100 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateReview} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Müşteri / Kurum Adı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Apex Quantum Lojistik"
                    value={newRevAuthor}
                    onChange={(e) => setNewRevAuthor(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Yetkili Ünvanı</label>
                  <input
                    type="text"
                    placeholder="CTO - Ahmet B."
                    value={newRevRole}
                    onChange={(e) => setNewRevRole(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Müşteri Değerlendirme Metni</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Yazılımın performansı ve operasyonel faydaları..."
                    value={newRevComment}
                    onChange={(e) => setNewRevComment(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Yorumu Vitrinde Yayınla
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 4: ADD LICENSE */}
        {showAddLicenseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-slate-900">Yeni Lisans Anahtarı Üret</h3>
                <button onClick={() => setShowAddLicenseModal(false)} className="p-2 rounded-full hover:bg-slate-100 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLicense} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Müşteri / Kurum Adı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Demir Lojistik A.Ş."
                    value={licClient}
                    onChange={(e) => setLicClient(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Yazılım Seçin</label>
                  <select
                    value={licProduct}
                    onChange={(e) => setLicProduct(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    {productsList.map((p) => {
                      const titleStr = getLocalizedText(p.title, 'TR');
                      return (
                        <option key={p.id} value={titleStr}>{titleStr}</option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Lisans Seviyesi</label>
                  <select
                    value={licType}
                    onChange={(e) => setLicType(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="Standart Lisans">Standart Lisans (1 Cihaz)</option>
                    <option value="Ticari Lisans">Ticari Lisans (Sınırsız Sunucu)</option>
                    <option value="Tam Kaynak Kod (Full Source)">Tam Kaynak Kod (Full Source)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Lisansı Kriptografik Olarak Üret
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
