import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts } from '../data/products';
import { translations } from '../utils/translations';
import { 
  sanitizeInput, 
  generateCryptoLicenseKey, 
  verifyLicenseIntegrity, 
  maskApiKey 
} from '../utils/security';
import { ApiService } from '../services/api';

export const CURRENCY_SYMBOLS = {
  TRY: '₺',
  USD: '$',
  EUR: '€'
};

const defaultInitialCategories = [
  { id: 'scraping', name: 'Veri Kazıma & Scraping', icon: 'Database', desc: 'Büyük ölçekli veri toplama ve web botları' },
  { id: 'bot', name: 'AI & Otonom Botlar', icon: 'Bot', desc: 'Müşteri hizmetleri ve yapay zeka otomasyonları' },
  { id: 'saas', name: 'SaaS & Web Altyapıları', icon: 'Layers', desc: 'Açık kaynaklı web ve platform yazılımları' },
  { id: 'fintech', name: 'Borsa & Finans Motorları', icon: 'TrendingUp', desc: 'Arbitraj, borsa ve kripto ticaret algoritmaları' },
  { id: 'devops', name: 'DevOps & CLI Araçları', icon: 'Terminal', desc: 'Sunucu, dağıtım ve altyapı araçları' },
];

const defaultInitialReviews = [
  {
    id: 'rev-1',
    author: 'Kaya Lojistik Grubu A.Ş.',
    role: 'CTO - Mehmet Kaya',
    company: 'Kaya Lojistik Grubu',
    rating: 5,
    verified: true,
    date: '2026-08-20',
    comment: 'AutoScrape Pro Cluster ile 4 farklı ülkeden saatlik 1.200.000 veri çekiyoruz. Cloudflare Turnstile engeline 1 kez bile takılmadı. Kod mimarisi ve performansı kusursuz.'
  },
  {
    id: 'rev-2',
    author: 'Quant Alpha Global Trading',
    role: 'Head of Quant - Burak V.',
    company: 'Quant Alpha Trading',
    rating: 5,
    verified: true,
    date: '2026-08-24',
    comment: 'ArbitrageX HFT Engine Rust çekirdeği inanılmaz hızlı. Binance ile Bybit arasındaki gecikme 2.1 ms seviyesinde. Tam kaynak kod aldığımız için kendi MEV algoritmalarımızı da ekledik.'
  },
  {
    id: 'rev-3',
    author: 'Nova Digital E-Ticaret A.Ş.',
    role: 'Kurucu - Zeynep A.',
    company: 'Nova Digital',
    rating: 5,
    verified: true,
    date: '2026-08-27',
    comment: 'OmniBot AI Gateway botunu WhatsApp hattımıza bağladığımız günden beri gece gelen müşteri sorularının %42si doğrudan siparişe dönüştü. Iyzico 3D entegrasyonu harika.'
  }
];

const defaultInitialOrders = [
  {
    id: 'ORD-8821',
    date: '2026-08-28 14:22',
    customerName: 'Kaya Lojistik Grubu A.Ş.',
    customerEmail: 'it-security@kayalojistik.com.tr',
    productTitle: 'AutoScrape Pro Cluster v4.2',
    licenseTier: 'Tam Kaynak Kod (Full Source)',
    amount: 10640,
    currency: 'TRY',
    paymentMethod: 'Iyzico 3D Secure',
    licenseKey: 'KDR-9X2L-88KV-491P-8N2A',
    status: 'Tamamlandı'
  },
  {
    id: 'ORD-7940',
    date: '2026-08-27 18:45',
    customerName: 'Quant Alpha Global Trading',
    customerEmail: 'desk@quantalpha.io',
    productTitle: 'ArbitrageX HFT Engine v2.6',
    licenseTier: 'Pro Trader Lisansı',
    amount: 11600,
    currency: 'TRY',
    paymentMethod: 'USDT TRC20 Crypto',
    licenseKey: 'KDR-72FA-99KP-33LV-7Q9D',
    status: 'Tamamlandı'
  },
  {
    id: 'ORD-6184',
    date: '2026-08-26 11:30',
    customerName: 'Nova Digital E-Ticaret A.Ş.',
    customerEmail: 'operasyon@novamoda.com',
    productTitle: 'OmniBot RAG AI Gateway v3.8',
    licenseTier: 'Ajans Lisansı',
    amount: 8640,
    currency: 'TRY',
    paymentMethod: 'Stripe Corporate Card',
    licenseKey: 'KDR-44MK-88PL-21QA-9W1C',
    status: 'Tamamlandı'
  }
];

const defaultInitialCustomers = [
  {
    id: 'CUST-101',
    name: 'Mehmet Kaya',
    company: 'Kaya Lojistik Grubu A.Ş.',
    email: 'it-security@kayalojistik.com.tr',
    phone: '+90 532 441 88 90',
    totalSpent: 10640,
    ordersCount: 1,
    status: 'Aktif',
    joinedDate: '2026-08-20'
  },
  {
    id: 'CUST-102',
    name: 'Burak V.',
    company: 'Quant Alpha Global Trading',
    email: 'desk@quantalpha.io',
    phone: '+44 20 7946 0912',
    totalSpent: 11600,
    ordersCount: 1,
    status: 'Aktif',
    joinedDate: '2026-08-24'
  },
  {
    id: 'CUST-103',
    name: 'Zeynep Aksoy',
    company: 'Nova Digital E-Ticaret A.Ş.',
    email: 'operasyon@novamoda.com',
    phone: '+90 533 890 12 34',
    totalSpent: 8640,
    ordersCount: 1,
    status: 'Aktif',
    joinedDate: '2026-08-26'
  }
];

const defaultInitialLicenses = [
  {
    id: 'lic-1',
    key: 'KDR-9X2L-88KV-491P-8N2A',
    client: 'Kaya Lojistik Grubu A.Ş.',
    email: 'it-security@kayalojistik.com.tr',
    product: 'AutoScrape Pro Cluster v4.2',
    tier: 'Tam Kaynak Kod (Full Source)',
    issuedDate: '2026-08-28',
    status: 'Aktif'
  },
  {
    id: 'lic-2',
    key: 'KDR-72FA-99KP-33LV-7Q9D',
    client: 'Quant Alpha Global Trading',
    email: 'desk@quantalpha.io',
    product: 'ArbitrageX HFT Engine v2.6',
    tier: 'Pro Trader Lisansı',
    issuedDate: '2026-08-27',
    status: 'Aktif'
  },
  {
    id: 'lic-3',
    key: 'KDR-44MK-88PL-21QA-9W1C',
    client: 'Nova Digital E-Ticaret A.Ş.',
    email: 'operasyon@novamoda.com',
    product: 'OmniBot RAG AI Gateway v3.8',
    tier: 'Ajans Lisansı',
    issuedDate: '2026-08-26',
    status: 'Aktif'
  }
];

const defaultInitialLeads = [
  {
    id: 'LEAD-501',
    name: 'Serdar Yıldız (Global Finans Danışmanlık)',
    contact: 'serdar@globalfinans.com.tr / +90 535 911 22 33',
    budget: '₺50.000 - ₺100.000+',
    category: 'fintech',
    details: 'Borsa İstanbul ve Binance vadeli işlemler arasında milisaniyelik spread yakalayıcı ve risk yönetim motoru geliştirmek istiyoruz.',
    date: '1 saat önce',
    status: 'İnceleniyor'
  },
  {
    id: 'LEAD-502',
    name: 'Elif Demir (OmniHealth Medikal)',
    contact: 'elif.demir@omnihealth.com',
    budget: '₺25.000 - ₺50.000',
    category: 'bot',
    details: 'WhatsApp üzerinden hasta randevusu oluşturan ve CRM veritabanına otomatik işleyen RAG yapay zeka asistanı talebi.',
    date: '3 saat önce',
    status: 'Yeni'
  }
];

const defaultInitialAuditLogs = [
  { id: 'log-1', action: 'Sistem Devrede', details: 'KODRAN.DEV WebCrypto Güvenlik Katmanı ve WAF aktif.', ip: '127.0.0.1', timestamp: 'Bugün 15:30' },
  { id: 'log-2', action: 'SSL Sertifikası', details: 'Let’s Encrypt 256-Bit SSL sertifikası doğrulandı.', ip: '127.0.0.1', timestamp: 'Bugün 15:31' },
  { id: 'log-3', action: 'Lisans Doğrulama', details: 'KDR-9X2L-88KV-491P-8N2A kriptografik imzası onaylandı.', ip: '176.240.112.4', timestamp: 'Bugün 15:35' },
  { id: 'log-4', action: 'XSS Kalkanı', details: 'Girdi temizleyici (Sanitizer) tüm formlarda devrede.', ip: '127.0.0.1', timestamp: 'Bugün 15:40' }
];

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Current Active View: 'store' or 'admin'
  const [currentView, setCurrentView] = useState('store');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Multi-Language State (TR / EN)
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('kodran_lang') || 'TR';
    } catch (e) {
      return 'TR';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kodran_lang', language);
    } catch (e) {}
  }, [language]);

  // Synchronize authenticated admin session from server HttpOnly cookie on mount
  useEffect(() => {
    let isMounted = true;
    ApiService.getAdminSession().then((res) => {
      if (isMounted && res && res.authenticated && res.user) {
        setUser(res.user);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Translation function t('key.path') with prototype pollution defenses
  const t = (path) => {
    if (!path || typeof path !== 'string') return '';
    const keys = path.split('.');
    for (const k of keys) {
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') return '';
    }
    const resolvePath = (obj) => {
      let node = obj;
      for (const k of keys) {
        if (!node || typeof node !== 'object' || !Object.prototype.hasOwnProperty.call(node, k)) {
          return null;
        }
        node = Reflect.get(node, k);
      }
      return node;
    };
    const primary = resolvePath(translations[language]);
    if (primary !== null && primary !== undefined) return primary;
    const fallback = resolvePath(translations.TR);
    if (fallback !== null && fallback !== undefined) return fallback;
    return path;
  };

  // Categories state (synced with localStorage)
  const [categoriesList, setCategoriesList] = useState(() => {
    try {
      const saved = localStorage.getItem('kodran_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultInitialCategories;
  });

  // Products state — always start from source-of-truth initialProducts
  // Only append user-created (admin panel) products from localStorage
  const [productsList, setProductsList] = useState(() => {
    try {
      const officialIds = new Set(initialProducts.map(p => p.id));
      const saved = localStorage.getItem('kodran_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Keep only user-created products (not in initialProducts)
          const userCreated = parsed.filter(p => !officialIds.has(p.id));
          if (userCreated.length > 0) {
            return [...initialProducts, ...userCreated.map(p => ({
              ...p,
              // Ensure all text fields are strings, not objects
              title: typeof p.title === 'object' ? (p.title.TR || p.title.EN || 'Yazılım') : (p.title || 'Yazılım'),
              subtitle: typeof p.subtitle === 'object' ? (p.subtitle.TR || p.subtitle.EN || '') : (p.subtitle || ''),
              description: typeof p.description === 'object' ? (p.description.TR || p.description.EN || '') : (p.description || ''),
              badge: typeof p.badge === 'object' ? (p.badge.TR || p.badge.EN || 'Kurumsal') : (p.badge || 'Kurumsal'),
              salesBadge: typeof p.salesBadge === 'object' ? (p.salesBadge.TR || p.salesBadge.EN || '') : (p.salesBadge || ''),
              roiText: typeof p.roiText === 'object' ? (p.roiText.TR || p.roiText.EN || '') : (p.roiText || ''),
              prices: p.prices || { TRY: 2800, USD: 85, EUR: 80 },
              techStack: Array.isArray(p.techStack) ? p.techStack : [],
              specs: Array.isArray(p.specs) ? p.specs : [],
              licenses: Array.isArray(p.licenses) && p.licenses.length > 0 ? p.licenses : [
                { type: 'Standart Lisans', priceMultiplier: 1, desc: '1 Cihaz / Sunucu için hazır kullanım.' },
                { type: 'Ticari Lisans', priceMultiplier: 2.2, desc: 'Sınırsız sunucu kurulumu ve ticari kullanım.' },
                { type: 'Tam Kaynak Kod (Full Source)', priceMultiplier: 3.8, desc: 'Bütün açık kaynak kodlar ve dökümantasyon.' }
              ]
            }))];
          }
        }
      }
      return initialProducts;
    } catch (e) {
      return initialProducts;
    }
  });

  // Real Orders state
  const [ordersList, setOrdersList] = useState(() => {
    try {
      const saved = localStorage.getItem('kodran_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultInitialOrders;
  });

  // Real Customers state
  const [customersList, setCustomersList] = useState(() => {
    try {
      const saved = localStorage.getItem('kodran_customers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultInitialCustomers;
  });

  // Reviews state
  const [reviewsList, setReviewsList] = useState(() => {
    try {
      const saved = localStorage.getItem('kodran_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultInitialReviews;
  });

  // Real Audit Logs
  const [auditLogsList, setAuditLogsList] = useState(() => {
    try {
      const saved = localStorage.getItem('kodran_audit_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultInitialAuditLogs;
  });

  // Newsletter Subscribers
  const [newsletterSubscribers, setNewsletterSubscribers] = useState(() => {
    try {
      const saved = localStorage.getItem('kodran_subscribers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  // Payment Gateways & Real API Keys
  const [paymentSettings, setPaymentSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('kodran_payment_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      stripeEnabled: true,
      stripePublishableKey: 'pk_test_sample_placeholder',
      stripeSecretKey: '••••••••••••••••••••••••••••••••',
      iyzicoEnabled: true,
      iyzicoApiKey: 'iyzico_api_configured',
      iyzicoSecretKey: '••••••••••••••••••••••••••••••••',
      cryptoEnabled: true,
      cryptoWallet: 'TX8892LaK91924821a99Zq001TRC20',
      bankEnabled: true,
      bankIban: 'TR42 0006 1000 0000 1234 5678 90',
      bankAccountName: 'KODRAN TEKNOLOJİ YAZILIM A.Ş.',
      bankName: 'Garanti BBVA - Levent Ticari Şube',
      isLiveMode: true
    };
  });

  // Telegram Alert Bot Settings
  const [telegramBotSettings, setTelegramBotSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('kodran_telegram_bot');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      isEnabled: true,
      botToken: '',
      chatId: '',
      notifyOnOrder: true,
      notifyOnLead: true,
      notifyOnRegistration: true
    };
  });

  // Sitewide Flash Sale Campaign
  const [flashSaleSettings, setFlashSaleSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('kodran_flash_sale');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      isEnabled: false,
      discountPercent: 15,
      title: '🔥 YAZILIM FESTİVALİ - TÜM HAZIR YAZILIMLARDA %15 ANINDA İNDİRİM',
      badgeText: 'Flaş Kampanya',
      endDate: '2026-09-01T23:59:59'
    };
  });

  // Security & Maintenance Mode
  const [securitySettings, setSecuritySettings] = useState(() => {
    try {
      const saved = localStorage.getItem('kodran_security_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      maintenanceMode: false,
      maintenanceMessage: 'KODRAN.DEV altyapısı güncelleniyor. Çok yakında yeni özelliklerle yayındayız.',
      blacklistIps: []
    };
  });

  // Coupons Manager
  const [couponsList, setCouponsList] = useState(() => {
    try {
      const saved = localStorage.getItem('kodran_coupons');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 'cpn-1', code: 'KODRAN20', discount: 20, description: 'Genel %20 Lansman İndirimi', status: 'Aktif' },
      { id: 'cpn-2', code: 'DEV2026', discount: 25, description: 'Geliştirici %25 İndirim Kuponu', status: 'Aktif' }
    ];
  });

  // General Site Settings
  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('kodran_site_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      brandName: 'KODRAN.DEV',
      supportTelegram: '@kodran_dev',
      supportEmail: 'destek@kodran.dev',
      announcement: 'Tüm yazılımlarda anında açık kaynak kod ve lisans teslimi aktiftir.'
    };
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('kodran_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      }
      return [];
    } catch (e) {
      return [];
    }
  });

  // Custom Project Leads
  const [customOrdersList, setCustomOrdersList] = useState(() => {
    try {
      const saved = localStorage.getItem('kodran_leads');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultInitialLeads;
  });

  // Licenses list
  const [licensesList, setLicensesList] = useState(() => {
    try {
      const saved = localStorage.getItem('kodran_licenses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultInitialLicenses;
  });

  const [currency, setCurrency] = useState('TRY');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCustomOrderOpen, setIsCustomOrderOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist states to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kodran_categories', JSON.stringify(categoriesList));
    } catch (e) {}
  }, [categoriesList]);

  useEffect(() => {
    try {
      localStorage.setItem('kodran_products', JSON.stringify(productsList));
    } catch (e) {}
  }, [productsList]);

  useEffect(() => {
    try {
      localStorage.setItem('kodran_orders', JSON.stringify(ordersList));
    } catch (e) {}
  }, [ordersList]);

  useEffect(() => {
    try {
      localStorage.setItem('kodran_customers', JSON.stringify(customersList));
    } catch (e) {}
  }, [customersList]);

  useEffect(() => {
    try {
      localStorage.setItem('kodran_reviews', JSON.stringify(reviewsList));
    } catch (e) {}
  }, [reviewsList]);

  useEffect(() => {
    try {
      localStorage.setItem('kodran_audit_logs', JSON.stringify(auditLogsList));
    } catch (e) {}
  }, [auditLogsList]);

  useEffect(() => {
    try {
      localStorage.setItem('kodran_subscribers', JSON.stringify(newsletterSubscribers));
    } catch (e) {}
  }, [newsletterSubscribers]);

  useEffect(() => {
    try {
      localStorage.setItem('kodran_payment_settings', JSON.stringify(paymentSettings));
    } catch (e) {}
  }, [paymentSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('kodran_telegram_bot', JSON.stringify(telegramBotSettings));
    } catch (e) {}
  }, [telegramBotSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('kodran_flash_sale', JSON.stringify(flashSaleSettings));
    } catch (e) {}
  }, [flashSaleSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('kodran_security_settings', JSON.stringify(securitySettings));
    } catch (e) {}
  }, [securitySettings]);

  useEffect(() => {
    try {
      localStorage.setItem('kodran_coupons', JSON.stringify(couponsList));
    } catch (e) {}
  }, [couponsList]);

  useEffect(() => {
    try {
      localStorage.setItem('kodran_site_settings', JSON.stringify(siteSettings));
    } catch (e) {}
  }, [siteSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('kodran_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('kodran_leads', JSON.stringify(customOrdersList));
    } catch (e) {}
  }, [customOrdersList]);

  useEffect(() => {
    try {
      localStorage.setItem('kodran_licenses', JSON.stringify(licensesList));
    } catch (e) {}
  }, [licensesList]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (action, details) => {
    const newLog = {
      id: `log-${Date.now().toString(36)}`,
      action,
      details,
      ip: '176.240.112.4',
      timestamp: 'Az önce'
    };
    setAuditLogsList((prev) => [newLog, ...prev]);
  };

  // Asynchronous Telegram Notification Sender
  const sendTelegramAlert = async (text) => {
    if (!telegramBotSettings.isEnabled || !telegramBotSettings.botToken || !telegramBotSettings.chatId) {
      return;
    }
    try {
      await fetch(`https://api.telegram.org/bot${telegramBotSettings.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramBotSettings.chatId,
          text: `⚡ [KODRAN.DEV BİLDİRİMİ]\n\n${text}`,
          parse_mode: 'HTML'
        })
      });
    } catch (e) {
      console.warn('Telegram bildirim hatası:', e);
    }
  };

  // Orders Actions
  const createOrder = (orderData) => {
    const sanitizedCustomerName = sanitizeInput(orderData.customerName || 'Müşteri');
    const sanitizedEmail = sanitizeInput(orderData.customerEmail || '');
    const sanitizedProductTitle = sanitizeInput(orderData.productTitle || 'Yazılım');
    const generatedLicense = orderData.licenseKey || generateCryptoLicenseKey('KDR');

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Tamamlandı',
      ...orderData,
      customerName: sanitizedCustomerName,
      customerEmail: sanitizedEmail,
      productTitle: sanitizedProductTitle,
      licenseKey: generatedLicense
    };
    setOrdersList((prev) => [newOrder, ...prev]);
    
    // Auto-update customer profile
    if (sanitizedEmail) {
      setCustomersList((prev) => {
        const existing = prev.find(c => c.email === sanitizedEmail);
        if (existing) {
          return prev.map(c => c.email === sanitizedEmail ? {
            ...c,
            totalSpent: (c.totalSpent || 0) + (Number(orderData.amount) || 0),
            ordersCount: (c.ordersCount || 0) + 1
          } : c);
        } else {
          return [
            {
              id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
              name: sanitizedCustomerName,
              company: 'Kurumsal Müşteri',
              email: sanitizedEmail,
              phone: '',
              totalSpent: Number(orderData.amount) || 0,
              ordersCount: 1,
              status: 'Aktif',
              joinedDate: new Date().toISOString().split('T')[0]
            },
            ...prev
          ];
        }
      });
    }

    addAuditLog('Yeni Sipariş', `#${newOrder.id} - ${sanitizedProductTitle} (${sanitizedCustomerName})`);

    // Telegram Bot Alert
    if (telegramBotSettings.notifyOnOrder) {
      sendTelegramAlert(
        `🎉 <b>YENİ SİPARİŞ ALINDI!</b>\n` +
        `📦 <b>Yazılım:</b> ${sanitizedProductTitle}\n` +
        `👤 <b>Müşteri:</b> ${sanitizedCustomerName} (${sanitizedEmail})\n` +
        `💰 <b>Tutar:</b> ₺${Number(orderData.amount).toLocaleString('tr-TR')} (${orderData.paymentMethod})\n` +
        `🔑 <b>Kriptografik Lisans:</b> <code>${generatedLicense}</code>`
      );
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: sanitizeInput(newStatus) } : o))
    );
    addToast(`Sipariş durumu "${newStatus}" olarak güncellendi.`);
    addAuditLog('Sipariş Güncelleme', `#${orderId} durumu "${newStatus}" yapıldı.`);
  };

  // Customer Management
  const addCustomer = (customerData) => {
    const newCust = {
      id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
      totalSpent: 0,
      ordersCount: 0,
      status: 'Aktif',
      joinedDate: new Date().toISOString().split('T')[0],
      ...customerData,
      name: sanitizeInput(customerData.name || ''),
      company: sanitizeInput(customerData.company || ''),
      email: sanitizeInput(customerData.email || ''),
      phone: sanitizeInput(customerData.phone || '')
    };
    setCustomersList((prev) => [newCust, ...prev]);
    addToast(`"${newCust.name}" müşterisi eklendi!`);
    addAuditLog('Müşteri Eklendi', `${newCust.name} (${newCust.company || 'Bireysel'})`);
  };

  const updateCustomerStatus = (customerId, newStatus) => {
    setCustomersList((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, status: sanitizeInput(newStatus) } : c))
    );
    addToast(`Müşteri durumu "${newStatus}" olarak güncellendi.`);
    addAuditLog('Müşteri Durumu', `#${customerId} durumu "${newStatus}" yapıldı.`);
  };

  const deleteCustomer = (customerId) => {
    setCustomersList((prev) => prev.filter((c) => c.id !== customerId));
    addToast('Müşteri kaydı silindi.', 'info');
    addAuditLog('Müşteri Silindi', `#${customerId} hesabı silindi.`);
  };

  // Reviews Management
  const addReview = (reviewData) => {
    const newRev = {
      id: `rev-${Date.now().toString(36)}`,
      verified: true,
      date: new Date().toISOString().split('T')[0],
      ...reviewData,
      author: sanitizeInput(reviewData.author || ''),
      role: sanitizeInput(reviewData.role || ''),
      company: sanitizeInput(reviewData.company || ''),
      comment: sanitizeInput(reviewData.comment || '')
    };
    setReviewsList((prev) => [newRev, ...prev]);
    addToast('Yeni müşteri değerlendirmesi yayınlandı!');
    addAuditLog('Yorum Eklendi', `${newRev.company} referansı vitrine eklendi.`);
  };

  const deleteReview = (reviewId) => {
    setReviewsList((prev) => prev.filter((r) => r.id !== reviewId));
    addToast('Müşteri yorumu kaldırıldı.', 'info');
  };

  // Broadcast & Newsletter
  const sendBroadcast = ({ channel, subject, message }) => {
    const cleanSubject = sanitizeInput(subject);
    const cleanMessage = sanitizeInput(message);
    addToast(`${channel === 'telegram' ? 'Telegram VIP Kanalına' : 'Tüm Abonelere'} duyuru başarıyla iletildi!`);
    addAuditLog('Toplu Duyuru', `${channel.toUpperCase()} kanalına "${cleanSubject}" duyurusu gönderildi.`);
    
    if (channel === 'telegram') {
      sendTelegramAlert(`📢 <b>${cleanSubject}</b>\n\n${cleanMessage}`);
    }
  };

  // Category CRUD
  const addCategory = (newCat) => {
    const catWithId = {
      id: newCat.id ? sanitizeInput(newCat.id).toLowerCase().trim() : `cat-${Date.now().toString(36)}`,
      name: sanitizeInput(newCat.name),
      icon: newCat.icon || 'Layers',
      desc: sanitizeInput(newCat.desc || '')
    };
    setCategoriesList((prev) => [...prev, catWithId]);
    addToast(`"${catWithId.name}" kategorisi başarıyla eklendi!`);
    addAuditLog('Kategori Eklendi', `"${catWithId.name}" kategorisi oluşturuldu.`);
  };

  const updateCategory = (categoryId, updatedCat) => {
    setCategoriesList((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, ...updatedCat, name: sanitizeInput(updatedCat.name || c.name) } : c))
    );
    addToast(`"${updatedCat.name || 'Kategori'}" başarıyla güncellendi!`);
    addAuditLog('Kategori Güncellendi', `"${categoryId}" kategorisi düzenlendi.`);
  };

  const deleteCategory = (categoryId) => {
    setCategoriesList((prev) => prev.filter((c) => c.id !== categoryId));
    addToast('Kategori silindi.', 'info');
    addAuditLog('Kategori Silindi', `"${categoryId}" kategorisi kaldırıldı.`);
  };

  // Price Calculation with Flash Sale Support
  const getProductPrice = (product, license = null, targetCurrency = currency) => {
    if (!product) return 0;
    const prices = product.prices || (typeof product === 'object' && product) || {};
    let basePrice = Number(prices[targetCurrency] || prices.TRY || prices.USD || 2800);
    
    // Apply Flash Sale Sitewide Discount if enabled
    if (flashSaleSettings.isEnabled && flashSaleSettings.discountPercent > 0) {
      basePrice = Math.round(basePrice * (1 - flashSaleSettings.discountPercent / 100));
    }

    const multiplier = Number(license?.priceMultiplier || 1);
    return Math.round(basePrice * multiplier);
  };

  const addToCart = (product, licenseTier = null) => {
    if (!product) return;
    const selectedLicense = licenseTier || product.licenses?.[0] || { type: 'Standart Lisans', priceMultiplier: 1, desc: 'Hazır Kurulum' };
    const cartItemId = `${product.id}-${selectedLicense.type}`;
    const titleStr = typeof product.title === 'object' ? (product.title[language] || product.title.TR || product.title.EN || 'Yazılım') : (product.title || 'Yazılım');

    setCart((prev) => {
      const existing = prev.find((item) => (item.id === cartItemId || item.cartItemId === cartItemId));
      if (existing) {
        addToast(`"${titleStr}" sepetteki adedi artırıldı.`);
        return prev.map((item) =>
          (item.id === cartItemId || item.cartItemId === cartItemId) ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        addToast(`"${titleStr}" sepete eklendi!`);
        return [
          ...prev,
          {
            id: cartItemId,
            cartItemId,
            title: titleStr,
            prices: product.prices || { TRY: 2800, USD: 85 },
            product,
            license: selectedLicense,
            licenseTier: selectedLicense,
            quantity: 1,
          },
        ];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId && item.cartItemId !== cartItemId));
    addToast('Ürün sepetten çıkarıldı.', 'info');
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId || item.cartItemId === cartItemId) {
            const newQty = (item.quantity || 1) + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addProduct = (newProduct) => {
    const cleanProduct = {
      ...newProduct,
      title: typeof newProduct.title === 'object' ? {
        TR: sanitizeInput(newProduct.title.TR),
        EN: sanitizeInput(newProduct.title.EN)
      } : sanitizeInput(newProduct.title),
      subtitle: typeof newProduct.subtitle === 'object' ? {
        TR: sanitizeInput(newProduct.subtitle.TR),
        EN: sanitizeInput(newProduct.subtitle.EN)
      } : sanitizeInput(newProduct.subtitle)
    };
    setProductsList((prev) => [cleanProduct, ...prev]);
    addToast(`"${cleanProduct.title?.TR || cleanProduct.title}" mağaza vitrinine eklendi!`);
    addAuditLog('Yazılım Yayınlandı', `"${cleanProduct.title?.TR || cleanProduct.title}" vitrine eklendi.`);
  };

  const updateProduct = (productId, updatedProduct) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updatedProduct } : p))
    );
    addToast(`"${updatedProduct.title?.TR || updatedProduct.title || 'Yazılım'}" başarıyla güncellendi!`);
    addAuditLog('Yazılım Düzenlendi', `"${productId}" güncellendi.`);
  };

  const deleteProduct = (productId) => {
    setProductsList((prev) => prev.filter((p) => p.id !== productId));
    addToast('Ürün vitrinden kaldırıldı.', 'info');
    addAuditLog('Yazılım Silindi', `"${productId}" ürünü vitrinden kaldırıldı.`);
  };

  const updatePaymentSettings = (newSettings) => {
    setPaymentSettings(newSettings);
    addToast('Ödeme altyapısı ve API anahtarları güncellendi!');
    addAuditLog('Ödeme Ayarları', 'Ödeme altyapıları ve API anahtarları güncellendi.');
  };

  const updateTelegramBotSettings = (newSettings) => {
    setTelegramBotSettings(newSettings);
    addToast('Telegram Bildirim Botu ayarları kaydedildi!');
    addAuditLog('Telegram Botu', 'Telegram bildirim botu ayarları güncellendi.');
  };

  const updateFlashSaleSettings = (newSettings) => {
    setFlashSaleSettings(newSettings);
    addToast(newSettings.isEnabled ? '⚡ Flaş İndirim Kampanyası Başlatıldı!' : 'Flaş Kampanya Sonlandırıldı.');
    addAuditLog('Flaş İndirim', newSettings.isEnabled ? `%${newSettings.discountPercent} genel indirim başlatıldı.` : 'Flaş indirim kapatıldı.');
  };

  const updateSecuritySettings = (newSettings) => {
    setSecuritySettings(newSettings);
    addToast(newSettings.maintenanceMode ? '⚠️ Site Bakım Moduna Alındı!' : 'Site Yayına Alındı.');
    addAuditLog('Güvenlik Ayarı', newSettings.maintenanceMode ? 'Bakım modu aktif edildi.' : 'Bakım modu kapatıldı.');
  };

  const addCoupon = (newCoupon) => {
    const cpn = {
      id: `cpn-${Date.now().toString(36)}`,
      status: 'Aktif',
      ...newCoupon,
      code: sanitizeInput(newCoupon.code).toUpperCase().trim(),
      description: sanitizeInput(newCoupon.description || '')
    };
    setCouponsList((prev) => [cpn, ...prev]);
    addToast(`"${cpn.code}" kuponu başarıyla oluşturuldu!`);
    addAuditLog('Kupon Eklendi', `"${cpn.code}" kuponu (%${newCoupon.discount}) aktif edildi.`);
  };

  const deleteCoupon = (couponId) => {
    setCouponsList((prev) => prev.filter((c) => c.id !== couponId));
    addToast('Kupon silindi.', 'info');
  };

  const updateSiteSettings = (newSettings) => {
    setSiteSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('Site ayarları güncellendi!');
    addAuditLog('Site Ayarları', 'Marka ve iletişim ayarları güncellendi.');
  };

  const addCustomOrder = (newOrder) => {
    const cleanName = sanitizeInput(newOrder.name || '');
    const cleanContact = sanitizeInput(newOrder.contact || '');
    const cleanDetails = sanitizeInput(newOrder.details || '');
    const cleanBudget = sanitizeInput(newOrder.budget || '');

    const orderWithId = {
      id: `LEAD-${Math.floor(100 + Math.random() * 900)}`,
      date: 'Az önce',
      status: 'Yeni',
      ...newOrder,
      name: cleanName,
      contact: cleanContact,
      details: cleanDetails,
      budget: cleanBudget
    };
    setCustomOrdersList((prev) => [orderWithId, ...prev]);
    addAuditLog('Yeni Proje Talebi', `${cleanName} tarafından ${newOrder.category} talebi iletildi.`);

    // Telegram Bot Alert
    if (telegramBotSettings.notifyOnLead) {
      sendTelegramAlert(
        `💼 <b>YENİ ÖZEL PROJE TALEBİ!</b>\n` +
        `👤 <b>Müşteri:</b> ${cleanName}\n` +
        `📱 <b>İletişim:</b> ${cleanContact}\n` +
        `💵 <b>Bütçe:</b> ${cleanBudget}\n` +
        `📝 <b>Detay:</b> ${cleanDetails}`
      );
    }
  };

  const updateLeadStatus = (orderId, newStatus) => {
    setCustomOrdersList((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: sanitizeInput(newStatus) } : ord))
    );
    addToast(`Talep durumu "${newStatus}" olarak güncellendi.`);
    addAuditLog('Talep Güncellendi', `Lead #${orderId} durumu "${newStatus}" yapıldı.`);
  };

  const addLicense = (licenseData) => {
    const cleanKey = licenseData.key || generateCryptoLicenseKey('KDR');
    const newLic = {
      ...licenseData,
      key: cleanKey,
      client: sanitizeInput(licenseData.client || 'Müşteri'),
      email: sanitizeInput(licenseData.email || ''),
      product: sanitizeInput(licenseData.product || 'Yazılım')
    };
    setLicensesList((prev) => [newLic, ...prev]);
    addToast(`Yeni Kriptografik Lisans Anahtarı üretildi: ${cleanKey}`);
    addAuditLog('Lisans Üretildi', `${newLic.client} için ${cleanKey} üretildi.`);
  };

  // Full Database Backup & Restore
  const exportDatabaseBackup = () => {
    const backupData = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      products: productsList,
      categories: categoriesList,
      orders: ordersList,
      customers: customersList,
      licenses: licensesList,
      reviews: reviewsList,
      leads: customOrdersList,
      coupons: couponsList,
      paymentSettings,
      telegramBotSettings,
      flashSaleSettings,
      securitySettings,
      siteSettings,
      auditLogs: auditLogsList
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kodran_enterprise_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Veritabanı yedeği (.JSON) başarıyla indirildi!');
    addAuditLog('Yedekleme', 'Tam veritabanı yedeği indirildi.');
  };

  const importDatabaseBackup = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.products) setProductsList(data.products);
      if (data.categories) setCategoriesList(data.categories);
      if (data.orders) setOrdersList(data.orders);
      if (data.customers) setCustomersList(data.customers);
      if (data.licenses) setLicensesList(data.licenses);
      if (data.reviews) setReviewsList(data.reviews);
      if (data.leads) setCustomOrdersList(data.leads);
      if (data.coupons) setCouponsList(data.coupons);
      if (data.paymentSettings) setPaymentSettings(data.paymentSettings);
      if (data.telegramBotSettings) setTelegramBotSettings(data.telegramBotSettings);
      if (data.flashSaleSettings) setFlashSaleSettings(data.flashSaleSettings);
      if (data.securitySettings) setSecuritySettings(data.securitySettings);
      if (data.siteSettings) setSiteSettings(data.siteSettings);
      
      addToast('Veritabanı yedeği başarıyla geri yüklendi!');
      addAuditLog('Geri Yükleme', 'Veritabanı yedeği sisteme aktarıldı.');
    } catch (e) {
      addToast('Geçersiz JSON yedek dosyası.', 'error');
    }
  };

  const resetToFactoryDefaults = () => {
    setOrdersList(defaultInitialOrders);
    setCustomersList(defaultInitialCustomers);
    setCustomOrdersList(defaultInitialLeads);
    setLicensesList(defaultInitialLicenses);
    setReviewsList(defaultInitialReviews);
    setProductsList(initialProducts);
    setCategoriesList(defaultInitialCategories);
    setAuditLogsList(defaultInitialAuditLogs);
    addToast('Sistem kurumsal fabrika ayarlarına sıfırlandı.', 'info');
    addAuditLog('Sıfırlama', 'Sistem kurumsal fabrika durumuna getirildi.');
  };

  const login = (userData) => {
    const cleanUser = {
      ...userData,
      email: sanitizeInput(userData.email),
      name: sanitizeInput(userData.name)
    };
    setUser(cleanUser);
    addAuditLog('Giriş Yapıldı', `${cleanUser.email} hesaba giriş yaptı.`);
  };

  const register = (userData) => {
    const newUser = {
      id: `usr_${Date.now().toString(36)}`,
      name: sanitizeInput(userData.name),
      company: sanitizeInput(userData.company || 'Bireysel Müşteri'),
      email: sanitizeInput(userData.email),
      phone: sanitizeInput(userData.phone || ''),
      role: 'customer'
    };
    setUser(newUser);
    addCustomer(newUser);
    addToast(`Kayıt Başarılı! Hoş geldiniz, ${newUser.name}.`);
    return newUser;
  };

  const logout = async () => {
    try {
      await ApiService.adminLogout();
    } catch (e) {}
    setUser(null);
    setCurrentView('store');
    addToast(language === 'EN' ? 'Logged out successfully.' : 'Çıkış yapıldı.');
  };

  const cartTotal = cart.reduce((sum, item) => {
    if (!item) return sum;
    const prod = item.product || item;
    const lic = item.license || item.licenseTier;
    const itemPrice = getProductPrice(prod, lic, currency);
    return sum + itemPrice * (item.quantity || 1);
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        isLoginModalOpen,
        setIsLoginModalOpen,
        user,
        setUser,
        login,
        register,
        logout,
        language,
        setLanguage,
        t,
        categoriesList,
        addCategory,
        updateCategory,
        deleteCategory,
        productsList,
        addProduct,
        updateProduct,
        deleteProduct,
        ordersList,
        createOrder,
        updateOrderStatus,
        customersList,
        addCustomer,
        updateCustomerStatus,
        deleteCustomer,
        reviewsList,
        addReview,
        deleteReview,
        auditLogsList,
        addAuditLog,
        newsletterSubscribers,
        sendBroadcast,
        paymentSettings,
        updatePaymentSettings,
        telegramBotSettings,
        updateTelegramBotSettings,
        sendTelegramAlert,
        flashSaleSettings,
        updateFlashSaleSettings,
        securitySettings,
        updateSecuritySettings,
        exportDatabaseBackup,
        importDatabaseBackup,
        resetToFactoryDefaults,
        couponsList,
        addCoupon,
        deleteCoupon,
        siteSettings,
        updateSiteSettings,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        currency,
        setCurrency,
        isCartOpen,
        setIsCartOpen,
        selectedProduct,
        setSelectedProduct,
        isCustomOrderOpen,
        setIsCustomOrderOpen,
        customOrdersList,
        addCustomOrder,
        updateLeadStatus,
        licensesList,
        addLicense,
        toasts,
        addToast,
        removeToast,
        activeFilter,
        setActiveFilter,
        searchQuery,
        setSearchQuery,
        getProductPrice,
        sanitizeInput,
        generateCryptoLicenseKey,
        verifyLicenseIntegrity,
        maskApiKey
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
