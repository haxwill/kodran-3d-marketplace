export const categoryTranslations = {
  all: { TR: 'Tüm Çözümler', EN: 'All Solutions' },
  scraping: { TR: 'Veri Kazıma & Scraping', EN: 'Web Scraping & Extraction' },
  bot: { TR: 'AI & Otonom Botlar', EN: 'AI & Autonomous Bots' },
  saas: { TR: 'SaaS & Web Altyapıları', EN: 'SaaS & Web Platforms' },
  fintech: { TR: 'Borsa & Finans Motorları', EN: 'Fintech & Arbitrage Bots' },
  devops: { TR: 'DevOps & CLI Araçları', EN: 'DevOps & Cloud Tools' },
};

export const initialProducts = [
  {
    id: 'autoscrape-enterprise',
    title: {
      TR: 'AutoScrape Pro Cluster v4.2',
      EN: 'AutoScrape Pro Cluster v4.2'
    },
    subtitle: {
      TR: 'Cloudflare Turnstile & Datadome Bypass Korumalı Dağıtık Veri Kazıma Motoru',
      EN: 'Distributed Web Scraping Cluster with Cloudflare Turnstile & Datadome Bypass'
    },
    category: 'scraping',
    badge: {
      TR: 'Kurumsal',
      EN: 'Enterprise'
    },
    salesBadge: {
      TR: '🔥 Canlı Üretimde • 218 Aktif Dağıtım',
      EN: '🔥 In Production • 218 Live Deployments'
    },
    roiText: {
      TR: 'Manuel veri toplama maliyetini %95 azaltır (Günlük 1.2M+ SKU)',
      EN: 'Reduces data gathering overhead by 95% (1.2M+ daily SKUs)'
    },
    rating: 4.95,
    reviewsCount: 68,
    salesCount: 218,
    prices: { TRY: 2800, USD: 85, EUR: 80 },
    icon: 'Database',
    accentColor: '#4f46e5',
    description: {
      TR: 'Amazon, Trendyol, Hepsiburada ve global e-ticaret platformlarından saatte 1.000.000+ veriyi IP engellerine takılmadan toplayan, Playwright Stealth ve Redis kuyruklu dağıtık Python motoru.',
      EN: 'High-throughput distributed Python cluster extracting 1,000,000+ items/hr across major e-commerce platforms using Playwright Stealth, residential proxy pools, and Redis job queues.'
    },
    specs: {
      TR: [
        'Otomatik Residential / 4G Mobil Proxy Havuz Rotasyonu',
        'TLS/JA3 Tarayıcı Parmak İzi (Fingerprint) Taklit Çekirdeği',
        'PostgreSQL, MongoDB, ElasticSearch ve CSV Otomatik Aktarımı',
        'Otomatik Cloudflare Turnstile ve hCaptcha Çözüm Motoru',
        'Telegram & Webhook Entegrasyonlu Anlık Fiyat Değişim Alarmları'
      ],
      EN: [
        'Automated Residential & 4G Mobile Proxy Pool Rotation',
        'TLS/JA3 Browser Fingerprint Spoofing Architecture',
        'Direct Pipeline to PostgreSQL, MongoDB, ElasticSearch & CSV',
        'Automated Cloudflare Turnstile & hCaptcha Solving Engine',
        'Instant Telegram & Webhook Price Anomaly Telemetry'
      ]
    },
    techStack: ['Python 3.12', 'Playwright Stealth', 'FastAPI', 'Redis', 'PostgreSQL', 'Docker'],
    licenses: {
      TR: [
        { type: 'Standart Lisans', priceMultiplier: 1, desc: '1 Sunucu / Cihaz için derlenmiş hazır kullanım ve 6 ay güncelleme.' },
        { type: 'Ticari Lisans', priceMultiplier: 2.2, desc: 'Sınırsız sunucu kurulumu, müşteri projeleri ve 1 yıl VIP teknik destek.' },
        { type: 'Tam Kaynak Kod (Full Source)', priceMultiplier: 3.8, desc: 'Tüm Python / Playwright açık kaynak kodları, mimari dökümanı ve yeniden markalama.' }
      ],
      EN: [
        { type: 'Standard License', priceMultiplier: 1, desc: 'Ready-to-deploy binary for 1 production server + 6 months updates.' },
        { type: 'Commercial License', priceMultiplier: 2.2, desc: 'Unlimited server deployments, client projects & 1-year priority support.' },
        { type: 'Full Source Code', priceMultiplier: 3.8, desc: 'Complete Python / Playwright codebase, architecture docs & rebranding rights.' }
      ]
    },
    snippet: `from autoscrape_core import ClusterEngine, StealthConfig

cluster = ClusterEngine(
    proxies="residential_smart_pool",
    fingerprint="chrome_v124_macos",
    stealth=StealthConfig(bypass_turnstile=True)
)

results = await cluster.scrape_catalog(
    url="https://target-marketplace.com/feed",
    concurrency=64,
    export_target="postgres://pool_db"
)
print(f"[SUCCESS] Ingested {len(results):,} SKUs without bot challenge.")`
  },
  {
    id: 'omnibot-ai-assistant',
    title: {
      TR: 'OmniBot RAG AI Gateway v3.8',
      EN: 'OmniBot RAG AI Gateway v3.8'
    },
    subtitle: {
      TR: 'WhatsApp Cloud API & Telegram Otonom Satış, Destek ve Ödeme Botu',
      EN: 'Autonomous Sales, Support & Payment AI Agent for WhatsApp & Telegram'
    },
    category: 'bot',
    badge: {
      TR: 'Popüler',
      EN: 'Popular'
    },
    salesBadge: {
      TR: '🔥 Çok Satan #1 • %99.4 Otomasyon Oranı',
      EN: '🔥 #1 Best Seller • 99.4% Automated Resolution'
    },
    roiText: {
      TR: 'Mesai dışı müşteri taleplerini %42 oranında anında satışa çevirir',
      EN: 'Converts 42% of after-hours customer inquiries into direct sales'
    },
    rating: 5.0,
    reviewsCount: 84,
    salesCount: 312,
    prices: { TRY: 3600, USD: 110, EUR: 100 },
    icon: 'Bot',
    accentColor: '#059669',
    description: {
      TR: 'OpenAI GPT-4o ve Claude 3.5 Sonnet ile şirketinizin PDF ürün kataloglarını RAG mimarisiyle tarayarak müşterilere 7/24 fiyat veren, stok sorgulayan ve Iyzico/Stripe 3D güvenli ödeme linki oluşturan yapay zeka satış asistanı.',
      EN: 'Production RAG conversational agent powered by GPT-4o & Claude 3.5. Reads product PDF catalogs, checks real-time inventory, and generates instant 3D-secure payment links directly inside chat.'
    },
    specs: {
      TR: [
        'Resmi WhatsApp Cloud API ve QR Kod Webhook Entegrasyonu',
        'PDF, Excel ve Web Sayfalarından Vektör Veritabanı Eğitimi (RAG)',
        'Sohbet İçinde Tek Tıkla Iyzico & Stripe 3D Güvenli Ödeme Linki',
        'Canlı Müşteri Temsilcisine Otomatik Devir (Human-in-the-loop)',
        'Next.js 14 Tabanlı Yönetici Paneli ve Canlı Sohbet Telemetrisi'
      ],
      EN: [
        'Official WhatsApp Cloud API & Webhook Gateway Engine',
        'PDF, Excel & Live Catalog Vector DB Training Pipeline (RAG)',
        'In-Chat 1-Click Stripe & Iyzico 3D Secure Checkout Links',
        'Automated Handover Trigger to Live Human Agents',
        'Next.js 14 Live Conversation Inspector & Analytics Dashboard'
      ]
    },
    techStack: ['TypeScript', 'Node.js', 'LangChain', 'OpenAI GPT-4o', 'Pinecone', 'PostgreSQL'],
    licenses: {
      TR: [
        { type: 'Standart Lisans', priceMultiplier: 1, desc: '1 İşletme / Numara için kullanıma hazır sürüm ve 6 ay güncelleme.' },
        { type: 'Ajans Lisansı', priceMultiplier: 2.4, desc: '10 Müşteri için çoklu bot yönetimi ve White-label marka desteği.' },
        { type: 'Tam Kaynak Kod (Full Source)', priceMultiplier: 4.2, desc: 'Tüm TypeScript backend, Next.js yönetim paneli ve açık RAG kodları.' }
      ],
      EN: [
        { type: 'Standard License', priceMultiplier: 1, desc: 'Ready-to-deploy for 1 business number + 6 months updates.' },
        { type: 'Agency License', priceMultiplier: 2.4, desc: 'Manage up to 10 client bots with full white-label branding.' },
        { type: 'Full Source Code', priceMultiplier: 4.2, desc: 'Complete TypeScript backend, Next.js UI & RAG pipeline source code.' }
      ]
    },
    snippet: `import { OmniAgent, WhatsAppProvider } from '@kodran/omnibot-core';

const agent = new OmniAgent({
  model: 'gpt-4o-2024-08-06',
  ragEngine: { vectorStore: 'pgvector', similarityThreshold: 0.88 },
  paymentGateway: { provider: 'iyzico_3d_secure', currency: 'TRY' }
});

agent.registerChannel(new WhatsAppProvider({ webhookPort: 8080 }));
await agent.initializeKnowledgeBase('./data/company_catalog.pdf');
console.log('[AGENT ONLINE] Ready to serve 24/7 client sales.');`
  },
  {
    id: 'arbitragex-engine',
    title: {
      TR: 'ArbitrageX HFT Engine v2.6',
      EN: 'ArbitrageX HFT Engine v2.6'
    },
    subtitle: {
      TR: 'CEX & DEX Kripto Borsaları Arası 2.1ms Milisaniyelik Arbitraj Çekirdeği',
      EN: 'Ultra-Low Latency 2.1ms CEX & DEX Cross-Market Arbitrage Core'
    },
    category: 'fintech',
    badge: {
      TR: 'Yüksek Hız',
      EN: 'Ultra Fast'
    },
    salesBadge: {
      TR: '⚡ 2.1ms Gecikme • Sıfır Slippage Algoritması',
      EN: '⚡ 2.1ms Latency • Zero-Slippage Execution'
    },
    roiText: {
      TR: 'Mevcut likidite havuzlarında Flash Loan ile sermayesiz arbitraj imkanı',
      EN: 'Zero-capital arbitrage execution via dynamic Flash Loan protocols'
    },
    rating: 4.9,
    reviewsCount: 52,
    salesCount: 124,
    prices: { TRY: 5800, USD: 175, EUR: 160 },
    icon: 'TrendingUp',
    accentColor: '#2563eb',
    description: {
      TR: 'Binance, Bybit, OKX ve Uniswap V3 arasındaki anlık spread fiyat farklarını milisaniyeler içinde yakalayan, MEV ve gas korumalı asenkron Rust Tokio arbitraj çekirdeği.',
      EN: 'Asynchronous Rust Tokio execution core scanning cross-exchange order books across Binance, Bybit, OKX, and Uniswap V3 with slippage and MEV sandwich protection.'
    },
    specs: {
      TR: [
        'Doğrudan WebSocket Akışı ile 2.1ms Altı Emir İletim Hızı',
        'Aave & Uniswap Flash Loan ile Sıfır Sermaye Arbitrajı',
        'Dinamik Slippage Kontrolü ve Önceden Gas Simülasyonu',
        'Telegram Kanalına Anlık Kâr, PnL ve Emir İletim Raporları'
      ],
      EN: [
        'Direct Kernel WebSocket Pipeline for Sub-2.1ms Routing',
        'Zero Capital Arbitrage via Aave & Uniswap Flash Loans',
        'Dynamic Slippage Protection & Pre-Execution Gas Simulation',
        'Instant Telegram Audit Trail with Profit & PnL Metrics'
      ]
    },
    techStack: ['Rust', 'Tokio', 'Web3.rs', 'Binance WebSocket', 'Redis', 'Telegram API'],
    licenses: {
      TR: [
        { type: 'Standart Lisans', priceMultiplier: 1, desc: '1 API anahtar çifti ile sınırsız işlem ve 6 ay algoritma güncellemeleri.' },
        { type: 'Pro Trader Lisansı', priceMultiplier: 2.0, desc: 'Sınırsız borsa hesabı ve özel düşük gecikmeli sunucu kurulum desteği.' },
        { type: 'Tam Kaynak Kod (Full Source)', priceMultiplier: 3.5, desc: 'Tüm Rust & Web3 açık kaynak kodları, strateji modülleri ve mimari.' }
      ],
      EN: [
        { type: 'Standard License', priceMultiplier: 1, desc: 'Unlimited execution for 1 API keypair + 6 months updates.' },
        { type: 'Pro Trader License', priceMultiplier: 2.0, desc: 'Unlimited exchange accounts + dedicated low-latency setup.' },
        { type: 'Full Source Code', priceMultiplier: 3.5, desc: 'Complete Rust & Web3 codebase, strategy modules & full rights.' }
      ]
    },
    snippet: `use arbitragex_core::{Engine, ExchangePair, Token};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut bot = Engine::builder()
        .pair(ExchangePair::BinanceBybit("BTC/USDT"))
        .min_spread_bps(12) // 0.12% net profit threshold
        .flash_loan_enabled(true)
        .build()?;

    bot.run_stream().await?;
    Ok(())
}`
  },
  {
    id: 'clouddeploy-cli',
    title: {
      TR: 'CloudDeploy DevOps CLI v5.0',
      EN: 'CloudDeploy DevOps CLI v5.0'
    },
    subtitle: {
      TR: 'Docker, Otomatik SSL, Nginx ve VPS Sunucu Yönetimini Otomatikleştiren CLI',
      EN: 'Enterprise CLI Automating Docker, Auto-SSL, Nginx & VPS Hardening'
    },
    category: 'devops',
    badge: {
      TR: 'Yeni',
      EN: 'New'
    },
    salesBadge: {
      TR: '⚡ 10 Saniyede Sıfırdan Sunucu Canlıya Alma',
      EN: '⚡ Provision Production Server in 10s'
    },
    roiText: {
      TR: 'Sunucu yapılandırma ve SSL yenileme hatalarını sıfıra indirir',
      EN: 'Eliminates server misconfigurations and manual SSL downtime'
    },
    rating: 4.95,
    reviewsCount: 38,
    salesCount: 142,
    prices: { TRY: 1900, USD: 60, EUR: 55 },
    icon: 'Terminal',
    accentColor: '#7c3aed',
    description: {
      TR: 'Yeni bir Ubuntu/Debian sunucusunu saniyeler içinde güvenlik duvarı (UFW), Fail2ban, Let’s Encrypt SSL, Docker Compose ve otomatik S3 yedekleme ile canlıya alan açık kaynaklı komut satırı aracı.',
      EN: 'Enterprise CLI provisioning raw Linux servers with hardened firewalls, automated Let’s Encrypt SSL rotation, Nginx reverse proxy, and automated S3 snapshot backups.'
    },
    specs: {
      TR: [
        'Tek Komutla Otomatik Let’s Encrypt SSL Kurulumu ve Yenileme',
        'Docker & Docker-Compose Konteyner Dağıtımı ve Otomatik Yeniden Başlatma',
        'UFW Güvenlik Duvarı, Fail2ban ve SSH Port Sıkılaştırma Kurulumu',
        'Otomatik Günlük S3 / Cloudflare R2 Veritabanı Yedekleme Görevleri'
      ],
      EN: [
        '1-Command Automated Let’s Encrypt SSL Issuance & Auto-Renewal',
        'Docker & Docker-Compose Container Orchestration with Auto-Heal',
        'UFW Firewall, Fail2ban & SSH Hardening Security Baseline',
        'Automated Daily S3 & Cloudflare R2 Database Snapshot Backups'
      ]
    },
    techStack: ['Go', 'Bash', 'Docker', 'Linux Kernel', 'Nginx'],
    licenses: {
      TR: [
        { type: 'Standart Lisans', priceMultiplier: 1, desc: '5 Sunucuya kadar sınırsız kurulum ve yönetim.' },
        { type: 'Sınırsız Lisans', priceMultiplier: 2.5, desc: 'Sınırsız sunucu yönetimi, ajans ve müşteri kullanımı.' }
      ],
      EN: [
        { type: 'Standard License', priceMultiplier: 1, desc: 'Deploy & manage up to 5 production servers.' },
        { type: 'Unlimited License', priceMultiplier: 2.5, desc: 'Unlimited server deployments for agencies & multi-client use.' }
      ]
    },
    snippet: `# Provision production server in 10 seconds
curl -sSL https://get.kodran.dev/clouddeploy | bash
clouddeploy server harden --firewall=strict --ssh-port=2222
clouddeploy stack up --domain=app.myclient.com --ssl=auto --docker-compose=./docker-compose.yml`
  },
  {
    id: 'saas-master-kit',
    title: {
      TR: 'SaaS Master Full-Stack Kit v6.1',
      EN: 'SaaS Master Full-Stack Kit v6.1'
    },
    subtitle: {
      TR: 'Iyzico & Stripe Çoklu Ödeme, RBAC Auth ve Müşteri Paneli İçeren Next.js 14 Şablonu',
      EN: 'Production Next.js 14 SaaS Foundation with Stripe, Iyzico & RBAC'
    },
    category: 'saas',
    badge: {
      TR: 'Kapsamlı',
      EN: 'Turnkey'
    },
    salesBadge: {
      TR: '🔥 3 Aylık Geliştirme Süresini 1 Güne İndirir',
      EN: '🔥 Shrinks 3 months of dev time into 1 day'
    },
    roiText: {
      TR: 'Ödeme, Auth, Faturalandırma ve Dashboard hazır anahtar teslim SaaS temeli',
      EN: 'Production-ready billing, auth, invoices and admin portal in one box'
    },
    rating: 5.0,
    reviewsCount: 92,
    salesCount: 245,
    prices: { TRY: 4400, USD: 135, EUR: 125 },
    icon: 'Layers',
    accentColor: '#0ea5e9',
    description: {
      TR: 'Next.js 14 App Router, TypeScript, Tailwind CSS, Prisma ORM ve Supabase ile hazırlanmış; Iyzico & Stripe abonelikleri, rol tabanlı yetkilendirme ve modern müşteri paneli içeren eksiksiz SaaS altyapısı.',
      EN: 'Full-stack Next.js 14 App Router codebase with TypeScript, Tailwind CSS, Prisma, and Supabase. Includes dual Stripe & Iyzico billing, customer dashboard, and RBAC authentication.'
    },
    specs: {
      TR: [
        'Iyzico, Stripe ve Kripto USDT Çoklu Ödeme Altyapısı',
        'NextAuth / Supabase ile Rol Tabanlı Kimlik Doğrulama (RBAC)',
        'Müşteri Paneli, Otomatik PDF Fatura İndirme ve Lisanslama',
        'Modern Karanlık / Aydınlık Mod ve Tailwind CSS Tasarım Sistemi'
      ],
      EN: [
        'Multi-Gateway Billing: Stripe, Iyzico & Crypto USDT Payments',
        'Role-Based Access Control via NextAuth & Supabase Auth',
        'Client Portal, Automated PDF Invoicing & License Manager',
        'Modern Dark/Light Mode & Tailwind CSS UI System'
      ]
    },
    techStack: ['Next.js 14', 'React 18', 'TypeScript', 'Prisma ORM', 'Tailwind CSS', 'Stripe', 'Iyzico'],
    licenses: {
      TR: [
        { type: 'Tek Proje Lisansı', priceMultiplier: 1, desc: '1 Ticari SaaS projesi oluşturma hakkı.' },
        { type: 'Sınırsız Geliştirici Lisansı', priceMultiplier: 2.2, desc: 'Sınırsız SaaS projesi ve müşteri projesi oluşturma hakkı.' }
      ],
      EN: [
        { type: 'Single Project License', priceMultiplier: 1, desc: 'Build 1 commercial SaaS product.' },
        { type: 'Unlimited Developer License', priceMultiplier: 2.2, desc: 'Build unlimited commercial SaaS products & client apps.' }
      ]
    },
    snippet: `import { KodranSaaSProvider, useSubscription } from '@kodran/saas-core';

export default function Dashboard() {
  const { plan, isActive, createCheckout } = useSubscription();

  return (
    <KodranSaaSProvider theme="dark" gateways={['iyzico', 'stripe']}>
      <SubscriptionCard plan={plan} onUpgrade={() => createCheckout('pro')} />
    </KodranSaaSProvider>
  );
}`
  },
  {
    id: 'devsecops-sentinel',
    title: {
      TR: 'DevSecOps Sentinel Core v2.0',
      EN: 'DevSecOps Sentinel Core v2.0'
    },
    subtitle: {
      TR: 'Kod Depoları İçin Otomatik Gizli Anahtar (Secret), Açık ve TLS Güvenlik Denetleyicisi',
      EN: 'Automated Secret Scanner, Dependency Auditor & TLS Security Verifier'
    },
    category: 'devops',
    badge: {
      TR: 'Güvenlik',
      EN: 'Security'
    },
    salesBadge: {
      TR: '🛡️ SOC2 & ISO 27001 Denetim Uyumlu',
      EN: '🛡️ SOC2 & ISO 27001 Audit Ready'
    },
    roiText: {
      TR: 'Git depolarına sızan API anahtarlarını ve güvenlik açıklarını anında yakalar',
      EN: 'Instantly catches leaked API keys and critical CVE vulnerabilities'
    },
    rating: 4.9,
    reviewsCount: 29,
    salesCount: 96,
    prices: { TRY: 2400, USD: 75, EUR: 70 },
    icon: 'Terminal',
    accentColor: '#10b981',
    description: {
      TR: 'Git commits, Docker imajları ve CI/CD pipeline süreçlerinde API anahtarlarını, şifreleri ve bağımlılık açıklarını (CVE) otomatik tarayan, Slack ve Telegram uyarıları gönderen güvenlik aracı.',
      EN: 'Automated vulnerability and secret scanner inspecting Git repositories, Docker images, and CI/CD pipelines for leaked credentials and critical CVE dependencies.'
    },
    specs: {
      TR: [
        '100+ Sağlayıcı İçin Regex ve Entropi Tabanlı API Key Tarayıcı',
        'CI/CD Pipeline (GitHub Actions & GitLab CI) Sıfır-Blok Entegrasyonu',
        'Otomatik CVE Güvenlik Açığı Tespiti ve Yama Önerisi',
        'Detaylı HTML / JSON Güvenlik Denetim Raporu Çıktısı'
      ],
      EN: [
        'Regex & Entropy-Based Secret Detection for 100+ Cloud Providers',
        'Seamless GitHub Actions & GitLab CI Pipeline Integration',
        'Automated CVE Vulnerability Scanning with Fix Recommendations',
        'Comprehensive HTML & JSON Security Audit Trail Export'
      ]
    },
    techStack: ['Rust', 'Go', 'Git Hooks', 'Docker', 'Linux CLI'],
    licenses: {
      TR: [
        { type: 'Standart Lisans', priceMultiplier: 1, desc: '5 Depo (Repo) için hazır kullanım ve 6 ay güncelleme.' },
        { type: 'Kurumsal Lisans', priceMultiplier: 2.2, desc: 'Sınırsız depo, kurum içi CI/CD entegrasyonu ve 1 yıl VIP destek.' }
      ],
      EN: [
        { type: 'Standard License', priceMultiplier: 1, desc: 'Scan up to 5 repositories with 6 months updates.' },
        { type: 'Enterprise License', priceMultiplier: 2.2, desc: 'Unlimited repositories, internal CI/CD & 1-year VIP support.' }
      ]
    },
    snippet: `# Run instant repository audit
sentinel scan --path=./backend-core --severity=HIGH
sentinel audit-cert --domain=kodran.dev --check-ciphers=true`
  }
];
