import React, { useState } from 'react';
import { useStore, CURRENCY_SYMBOLS } from '../context/StoreContext';
import { getLocalizedText } from '../utils/translations';
import { ApiService } from '../services/api';
import { 
  X, 
  Lock, 
  Unlock, 
  KeyRound, 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  Users, 
  Layers, 
  ShoppingBag, 
  Radio, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Server, 
  RefreshCw, 
  Copy, 
  ExternalLink,
  DollarSign,
  Download,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export const AdminPanel = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    productsList, 
    addProduct, 
    deleteProduct, 
    customOrdersList, 
    updateOrderStatus,
    licensesList,
    addLicense,
    currency,
    addToast
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'leads', 'licenses', 'servers'

  // New Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdSubtitle, setNewProdSubtitle] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('scraping');
  const [newProdPriceTRY, setNewProdPriceTRY] = useState(3000);
  const [newProdPriceUSD, setNewProdPriceUSD] = useState(90);
  const [newProdTech, setNewProdTech] = useState('Python, Playwright, Docker');
  const [newProdFeatures, setNewProdFeatures] = useState('Anti-Bot Koruması, Çoklu Thread, JSON/Excel Çıktı');

  // New License Modal State
  const [showAddLicenseModal, setShowAddLicenseModal] = useState(false);
  const [licClient, setLicClient] = useState('');
  const [licProduct, setLicProduct] = useState(productsList[0]?.title || 'OmniScrape Pro Max');
  const [licType, setLicType] = useState('Ticari Lisans');

  // Server Clusters Simulated State
  const [serverNodes, setServerNodes] = useState([
    { id: 'node-fra-01', name: 'Frankfurt Anti-Bot Scraper Cluster', cpu: 42, ram: '3.4 GB / 8 GB', ping: '18ms', activeWorkers: 140, status: 'ONLINE' },
    { id: 'node-ist-02', name: 'Istanbul WhatsApp / AI Webhook Gateway', cpu: 24, ram: '1.8 GB / 4 GB', ping: '8ms', activeWorkers: 65, status: 'ONLINE' },
    { id: 'node-nyc-03', name: 'New York High-Frequency Arbitrage Node', cpu: 78, ram: '6.1 GB / 16 GB', ping: '4ms', activeWorkers: 320, status: 'ONLINE' },
    { id: 'node-lon-04', name: 'London SaaS PostgreSQL Backup & Vector DB', cpu: 15, ram: '2.2 GB / 8 GB', ping: '22ms', activeWorkers: 28, status: 'ONLINE' },
  ]);

  if (!isAdminOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await ApiService.adminLogin(pinCode);
      if (res && res.user) {
        setIsAuthenticated(true);
        soundFX.playLaser();
        addToast('KODRAN Yönetici Paneli Açıldı (Admin Access Granted).');
      }
    } catch (err) {
      soundFX.playClick();
      addToast('Giriş bilgileri geçersiz.', 'error');
    }
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProdTitle || !newProdSubtitle) return;

    const newProd = {
      id: `aeth-${Date.now().toString(36)}`,
      title: newProdTitle,
      subtitle: newProdSubtitle,
      category: newProdCategory,
      badge: 'Yeni',
      badgeColor: 'indigo',
      rating: 5.0,
      reviewsCount: 1,
      salesCount: 0,
      prices: { TRY: Number(newProdPriceTRY), USD: Number(newProdPriceUSD), EUR: Math.round(Number(newProdPriceUSD) * 0.92) },
      icon: newProdCategory === 'bot' ? 'Bot' : newProdCategory === 'scraping' ? 'DatabaseZap' : 'Layers',
      accentColor: '#6366f1',
      description: newProdSubtitle,
      detailedSpecs: [
        'Aetheris v4.8 Kuantum Çekirdeği ile Güçlendirildi',
        'Yüksek Verimli Asenkron Mimarisi',
        'Docker ve REST API Desteği'
      ],
      featuresList: newProdFeatures.split(',').map((f) => f.trim()),
      techStack: newProdTech.split(',').map((t) => t.trim()),
      supportedOS: ['Windows 11', 'Linux Ubuntu', 'macOS'],
      demoSnippet: `# Aetheris Kurulumu\nimport aetheris_core\nengine = aetheris_core.Engine()\nengine.run()`,
      demoCommand: 'python run_core.py',
      terminalOutput: [
        '[AETHERIS] Modül başlatıldı.',
        '[SYSTEM] Lisans doğrulandı.',
        '[OK] Görev başarıyla tamamlandı.'
      ],
      licenses: [
        { type: 'Standart Lisans', priceMultiplier: 1, desc: '1 Cihaz için binary çalıştırma hakkı.' },
        { type: 'Ticari Lisans', priceMultiplier: 2.2, desc: 'Sınırsız sunucu kurulumu ve ticari hizmet sağlama.' },
        { type: 'Tam Kaynak Kod (Full Source)', priceMultiplier: 3.8, desc: 'Bütün açık kaynak kodlar ve yeniden markalama hakkı.' }
      ]
    };

    addProduct(newProd);
    soundFX.playLaser();
    setShowAddProductModal(false);
    // Reset form
    setNewProdTitle('');
    setNewProdSubtitle('');
  };

  const handleCreateLicense = (e) => {
    e.preventDefault();
    if (!licClient) return;

    const randomKey = `AETH-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}-DEV`;
    
    addLicense({
      key: randomKey,
      client: licClient,
      product: licProduct,
      type: licType,
      status: 'Aktif',
      created: new Date().toISOString().split('T')[0]
    });

    soundFX.playLaser();
    setShowAddLicenseModal(false);
    setLicClient('');
  };

  const restartNode = (nodeId) => {
    soundFX.playLaser();
    setServerNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, status: 'RESTARTING...' } : n))
    );
    addToast(`${nodeId} düğümü yeniden başlatılıyor...`, 'info');

    setTimeout(() => {
      setServerNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, status: 'ONLINE', cpu: Math.floor(10 + Math.random() * 30) } : n))
      );
      addToast(`${nodeId} başarıyla çevrimiçi oldu!`);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      
      {/* Container */}
      <div 
        className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 min-h-[680px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAdminOpen(false);
            soundFX.playClick();
          }}
          className="absolute top-5 right-5 z-30 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SECURITY PIN LOCK SCREEN */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 mb-6 shadow-inner animate-pulse-subtle">
              <Lock className="w-8 h-8" />
            </div>

            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-slate-900 text-cyan-400 mb-3">
              AETHERIS // SECURE GATEWAY
            </span>

            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
              Yönetici Paneli Girişi
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Yazılımlarınızı yönetmek, sipariş taleplerini incelemek ve lisans anahtarı üretmek için PIN kodunuzu giriniz.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  autoFocus
                  placeholder="Yönetici PIN Kodu Giriniz"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center font-mono text-lg tracking-widest text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-sm shadow-xl shadow-slate-900/10 hover:shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <Unlock className="w-4 h-4 text-cyan-400" />
                <span>Panele Giriş Yap</span>
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col">
            
            {/* Top Navigation & Brand Header */}
            <div className="p-6 bg-slate-950 text-white border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-mono font-bold shadow-md shadow-indigo-600/30">
                  <Radio className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold tracking-tight font-mono">
                      AETHERIS<span className="text-cyan-400">.CORE</span> // ADMIN
                    </h2>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                      SUPERUSER
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Yazılım Portföyü, Sipariş & Lisans Yönetim Merkezi</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
                {[
                  { id: 'overview', label: 'Genel Bakış', icon: TrendingUp },
                  { id: 'products', label: `Ürünler (${productsList.length})`, icon: Layers },
                  { id: 'leads', label: `Müşteri Talepleri (${customOrdersList.length})`, icon: MessageSquare },
                  { id: 'licenses', label: `Lisanslar (${licensesList.length})`, icon: KeyRound },
                  { id: 'servers', label: 'Bot Düğümleri', icon: Server },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        soundFX.playClick();
                      }}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MAIN TAB CONTENT AREA */}
            <div className="flex-1 p-6 sm:p-8 bg-slate-50/50 overflow-y-auto">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-in fade-in">
                  
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider font-mono">Toplam Hasılat</span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <DollarSign className="w-4 h-4" />
                        </div>
                      </div>
                      <h4 className="text-2xl font-extrabold text-slate-900 font-mono">₺384,250</h4>
                      <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-block">↑ %32 Bu Ayki Büyüme</span>
                    </div>

                    <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider font-mono">Aktif Lisanslar</span>
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <KeyRound className="w-4 h-4" />
                        </div>
                      </div>
                      <h4 className="text-2xl font-extrabold text-slate-900 font-mono">842 Adet</h4>
                      <span className="text-[11px] font-medium text-slate-500 mt-1 inline-block">0 İptal / İade Talebi</span>
                    </div>

                    <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider font-mono">Gelen Talepler</span>
                        <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                      </div>
                      <h4 className="text-2xl font-extrabold text-slate-900 font-mono">{customOrdersList.length} Yeni Proje</h4>
                      <span className="text-[11px] font-bold text-cyan-600 mt-1 inline-block">İnceleme Bekliyor</span>
                    </div>

                    <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider font-mono">Bot İşçi Düğümleri</span>
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                          <Cpu className="w-4 h-4" />
                        </div>
                      </div>
                      <h4 className="text-2xl font-extrabold text-slate-900 font-mono">545 Worker</h4>
                      <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-block">● %99.98 Uptime</span>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        setShowAddProductModal(true);
                        soundFX.playLaser();
                      }}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Yeni Yazılım / Bot Ekle</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowAddLicenseModal(true);
                        soundFX.playLaser();
                      }}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all"
                    >
                      <KeyRound className="w-4 h-4 text-cyan-400" />
                      <span>Müşteriye Özel Lisans Üret</span>
                    </button>
                  </div>

                  {/* Recent Leads Feed */}
                  <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-indigo-600" />
                        Son Gelen Özel Proje & Bot Talepleri
                      </h4>
                      <button
                        onClick={() => setActiveTab('leads')}
                        className="text-xs text-indigo-600 font-bold hover:underline"
                      >
                        Tümünü Gör ({customOrdersList.length}) →
                      </button>
                    </div>

                    <div className="space-y-3">
                      {customOrdersList.slice(0, 3).map((lead) => (
                        <div key={lead.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{lead.name}</span>
                              <span className="text-[10px] font-mono text-slate-400">• {lead.date}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{lead.details}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-bold">
                              {lead.budget}
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                              {lead.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: PRODUCTS MANAGEMENT */}
              {activeTab === 'products' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Yazılım & Bot Kataloğu Yönetimi</h3>
                      <p className="text-xs text-slate-500">Katalogdaki yazılımları düzenleyebilir, silebilir veya anında yeni ürün ekleyebilirsiniz.</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowAddProductModal(true);
                        soundFX.playLaser();
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Yeni Ürün Ekle</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {productsList.map((prod) => (
                      <div key={prod.id} className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                              {prod.category.toUpperCase()}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-900">
                              ₺{prod.prices.TRY.toLocaleString('tr-TR')} / ${prod.prices.USD}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-slate-900 mb-1">{getLocalizedText(prod.title, 'TR')}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mb-3">{getLocalizedText(prod.subtitle, 'TR')}</p>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {prod.techStack.map((tech, i) => (
                              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                          <span className="text-slate-400 font-mono">{prod.salesCount} Satış</span>
                          <button
                            onClick={() => deleteProduct(prod.id)}
                            className="flex items-center gap-1 text-rose-500 hover:text-rose-700 font-semibold p-1.5 rounded-xl hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Sil</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: LEADS & CUSTOM REQUESTS */}
              {activeTab === 'leads' && (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Gelen Özel Proje & Bot Talepleri</h3>
                    <p className="text-xs text-slate-500">Müşterilerin web sitesi üzerinden gönderdiği özel otomasyon talepleri.</p>
                  </div>

                  <div className="space-y-4">
                    {customOrdersList.map((lead) => (
                      <div key={lead.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900">{lead.name}</span>
                              <span className="text-xs font-mono text-indigo-600 font-bold">({lead.contact})</span>
                            </div>
                            <span className="text-[11px] text-slate-400">{lead.date} • Kategori: <strong>{lead.category}</strong></span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-bold">
                              Bütçe: {lead.budget}
                            </span>
                            
                            {/* Status Changer */}
                            <select
                              value={lead.status}
                              onChange={(e) => updateOrderStatus(lead.id, e.target.value)}
                              className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                            >
                              <option value="Yeni">🔴 Yeni</option>
                              <option value="İletişime Geçildi">🟡 İletişime Geçildi</option>
                              <option value="Teklif Gönderildi">🔵 Teklif Gönderildi</option>
                              <option value="Onaylandı & Başlandı">🟢 Onaylandı</option>
                            </select>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                          {lead.details}
                        </p>

                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`https://t.me/${lead.contact.replace('@', '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#229ED9] text-white text-xs font-bold shadow-sm"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Telegram'dan Yaz</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: LICENSES MANAGEMENT */}
              {activeTab === 'licenses' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Kuantum Lisans Anahtarları</h3>
                      <p className="text-xs text-slate-500">Müşterilere teslim edilen aktif yazılım lisans anahtarları ve durumları.</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowAddLicenseModal(true);
                        soundFX.playLaser();
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Yeni Lisans Üret</span>
                    </button>
                  </div>

                  <div className="p-6 rounded-3xl bg-white border border-slate-200 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-mono uppercase">
                          <th className="pb-3 font-semibold">Lisans Anahtarı</th>
                          <th className="pb-3 font-semibold">Müşteri</th>
                          <th className="pb-3 font-semibold">Yazılım</th>
                          <th className="pb-3 font-semibold">Lisans Tipi</th>
                          <th className="pb-3 font-semibold">Durum</th>
                          <th className="pb-3 font-semibold text-right">İşlem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {licensesList.map((lic, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 font-mono font-bold text-slate-900 select-all">{lic.key}</td>
                            <td className="py-3 text-slate-700 font-medium">{lic.client}</td>
                            <td className="py-3 text-indigo-600 font-semibold">{lic.product}</td>
                            <td className="py-3 text-slate-600">{lic.type}</td>
                            <td className="py-3">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                                {lic.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(lic.key);
                                  addToast('Lisans anahtarı kopyalandı!');
                                }}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                                title="Kopyala"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: BOT SERVERS & HEALTH */}
              {activeTab === 'servers' && (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Canlı Bot Düğümleri & Sunucu Kümesi</h3>
                    <p className="text-xs text-slate-500">Müşterilerinizin botlarını ve scraping işlemlerini çalıştıran bulut altyapınızın canlı metrikleri.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serverNodes.map((node) => (
                      <div key={node.id} className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-mono font-bold text-cyan-400">{node.id}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              node.status === 'ONLINE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              ● {node.status}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-100 mb-4">{node.name}</h4>

                          <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-slate-900 border border-slate-800 mb-4">
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 block">CPU Yükü</span>
                              <span className="text-sm font-mono font-bold text-indigo-400">%{node.cpu}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 block">RAM Kullanımı</span>
                              <span className="text-sm font-mono font-bold text-slate-200">{node.ram.split(' ')[0]}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 block">Gecikme</span>
                              <span className="text-sm font-mono font-bold text-emerald-400">{node.ping}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                          <span className="text-slate-400 font-mono">{node.activeWorkers} Aktif Eşzamanlı İş Parçacığı</span>
                          <button
                            onClick={() => restartNode(node.id)}
                            className="flex items-center gap-1 text-slate-300 hover:text-cyan-400 font-mono text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Yeniden Başlat</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* MODAL: YENİ ÜRÜN EKLE */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <button
              onClick={() => setShowAddProductModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Yeni Yazılım / Bot Ekle</h3>
            <p className="text-xs text-slate-500 mb-6">Kataloğa ekleyeceğiniz yazılım anında vitrinde yayınlanacaktır.</p>

            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Yazılım Başlığı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: AutoTrader Solana Arbitrage Bot"
                  value={newProdTitle}
                  onChange={(e) => setNewProdTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Açıklama / Alt Başlık *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Raydium & Orca arası milisaniyelik arbitraj botu."
                  value={newProdSubtitle}
                  onChange={(e) => setNewProdSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Kategori</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <option value="scraping">Scraper</option>
                    <option value="bot">Bot / AI</option>
                    <option value="web">SaaS / Web</option>
                    <option value="desktop">CLI / Masaüstü</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Fiyat (TRY)</label>
                  <input
                    type="number"
                    value={newProdPriceTRY}
                    onChange={(e) => setNewProdPriceTRY(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Fiyat (USD)</label>
                  <input
                    type="number"
                    value={newProdPriceUSD}
                    onChange={(e) => setNewProdPriceUSD(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Teknolojiler (Virgülle Ayırın)</label>
                <input
                  type="text"
                  placeholder="Python, Rust, FastAPI"
                  value={newProdTech}
                  onChange={(e) => setNewProdTech(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Öne Çıkan Özellikler (Virgülle Ayırın)</label>
                <input
                  type="text"
                  placeholder="Anti-Bot Bypass, Hızlı Proxy, Canlı Bildirim"
                  value={newProdFeatures}
                  onChange={(e) => setNewProdFeatures(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  Yazılımı Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: YENİ LİSANS ÜRET */}
      {showAddLicenseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <button
              onClick={() => setShowAddLicenseModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Yeni Lisans Anahtarı Üret</h3>
            <p className="text-xs text-slate-500 mb-6">Müşterinize özel şifreli kriptografik lisans kodu oluşturur.</p>

            <form onSubmit={handleCreateLicense} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Müşteri Adı / Şirket *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Volkan Şen (Sen Tech)"
                  value={licClient}
                  onChange={(e) => setLicClient(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Lisanslanacak Yazılım</label>
                <select
                  value={licProduct}
                  onChange={(e) => setLicProduct(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Lisans Paketi Tipi</label>
                <select
                  value={licType}
                  onChange={(e) => setLicType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <option value="Standart Lisans">Standart Lisans (1 PC/Sunucu)</option>
                  <option value="Ticari Lisans">Ticari Lisans (Sınırsız Kurulum)</option>
                  <option value="Tam Kaynak Kod (Full Source)">Tam Kaynak Kod (Açık Kaynak & Lisans)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLicenseModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-md"
                >
                  Lisansı Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
