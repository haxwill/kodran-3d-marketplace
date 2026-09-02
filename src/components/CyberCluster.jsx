import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Activity, 
  Cpu, 
  Server, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Wifi, 
  Check, 
  Copy, 
  Play,
  RotateCw
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CyberCluster = () => {
  const { addToast } = useStore();
  const [activeCommand, setActiveCommand] = useState('status');
  const [terminalOutput, setTerminalOutput] = useState([
    '[INIT] Aetheris Quantum Cluster OS v4.2.0 loaded.',
    '[NODE 01] Frankfurt Scraper Node: ONLINE (CPU: 32%, RAM: 2.1 GB, Threads: 512)',
    '[NODE 02] Istanbul AI Webhook Hub: ONLINE (GPT-4o latency: 120ms)',
    '[NODE 03] New York Arbitrage Engine: ONLINE (Binance/Bybit WebSocket 3ms)',
    '[CLUSTER] All 4 master nodes synchronized. Ready for deployment.',
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  const runCommand = (cmd) => {
    setActiveCommand(cmd);
    setIsSimulating(true);

    if (cmd === 'scrape') {
      setTerminalOutput([
        '$ autoscrape --pool=residential --threads=128 --bypass=turnstile',
        '[SYS] Initializing 128 rotating IP addresses...',
        '[BYPASS] Cloudflare Challenge PASSED in 0.12s ✓',
        '[DATA] Extracted 48,200 product items from target marketplace.',
        '[S3] Encrypted payload uploaded to AWS S3 bucket [us-east-1].',
        '[STATUS] Job completed with 0 errors.',
      ]);
    } else if (cmd === 'bot') {
      setTerminalOutput([
        '$ omnibot --channel=whatsapp --model=gpt-4o --rag=pdf_catalog',
        '[WEBHOOK] Listening on port 8080 (SSL Verified)...',
        '[AI] Incoming customer prompt: "AutoScrape lisansı nasıl alınır?"',
        '[RAG] PDF Vector search found 3 matching chunks.',
        '[REPLY] Generated conversational response + instant payment link.',
        '[STATUS] Message delivered in 340ms ✓',
      ]);
    } else if (cmd === 'algo') {
      setTerminalOutput([
        '$ arbitragex --dex=uniswap_v3 --cex=binance --pair=ETH/USDT',
        '[SCAN] Listening to Binance orderbook & Uniswap pool...',
        '[SIGNAL] Price disparity detected: 0.92% spread on ETH.',
        '[FLASH] Borrowed 100 ETH via Aave Flash Loan (Zero Collateral).',
        '[EXECUTE] Arbitrage trade executed across blocks [19284012].',
        '[PROFIT] Net Profit: +$1,420.80 USDT secured into wallet ✓',
      ]);
    } else {
      setTerminalOutput([
        '$ aetheris --cluster-health',
        '[CPU] 4 Clusters: 18% Average Load',
        '[MEMORY] 64GB DDR5: 14.2 GB in use',
        '[UPTIME] 99.98% over last 180 days',
        '[NETWORK] Total throughput: 1.42 GB/s',
      ]);
    }

    setTimeout(() => {
      setIsSimulating(false);
      addToast(`Komut başarıyla çalıştırıldı: ${cmd}`);
    }, 400);
  };

  const nodes = [
    { city: 'Frankfurt, DE', name: 'Scraper Cluster 01', ip: '194.28.112.4', ping: '12ms', status: 'Optimal', load: '34%' },
    { city: 'Istanbul, TR', name: 'AI WhatsApp Hub', ip: '88.245.10.12', ping: '4ms', status: 'Optimal', load: '21%' },
    { city: 'New York, US', name: 'Arbitrage Engine Node', ip: '142.250.190.46', ping: '28ms', status: 'Optimal', load: '48%' },
    { city: 'Tokyo, JP', name: 'Backup Data Vault', ip: '133.242.18.90', ping: '64ms', status: 'Optimal', load: '14%' },
  ];

  return (
    <section className="py-20 bg-slate-950 text-white relative overflow-hidden selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Background Laser Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-cyan-300 text-xs font-mono font-bold border border-slate-800 mb-4 shadow-lg shadow-cyan-500/10">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>GLOBAL CLUSTER TELEMETRY // 24/7 LIVE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase">
            Canlı Bulut Sunucu & <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Bot Komuta Merkezi</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-medium max-w-xl mx-auto">
            Geliştirdiğimiz bot ve otomasyon motorlarının küresel sunuculardaki canlı çalışma performansını ve yanıt hızlarını anlık test edin.
          </p>
        </div>

        {/* 2-Column Grid: Left Global Nodes, Right Interactive Hacker Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Global Nodes (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Aktif Bot Sunucu Düğümleri</span>
            </h3>

            <div className="space-y-3">
              {nodes.map((node, i) => (
                <div 
                  key={i} 
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center justify-between gap-3 font-mono text-xs shadow-lg shadow-black/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 font-bold text-slate-100">
                        <span>{node.city}</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      </div>
                      <span className="text-[11px] text-slate-400 font-normal">{node.name}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-emerald-400 font-bold block">{node.ping}</span>
                    <span className="text-[10px] text-slate-500">CPU: {node.load}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Live Interactive Hacker Terminal (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden font-mono">
            
            {/* Terminal Header */}
            <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-xs font-bold text-slate-300 ml-2">aetheris@cluster-node-01:~</span>
              </div>

              {/* Terminal Quick Command Triggers */}
              <div className="flex items-center gap-1.5 text-xs">
                {[
                  { id: 'status', label: '📊 Status' },
                  { id: 'scrape', label: '🕷️ Scrape' },
                  { id: 'bot', label: '🤖 AI Bot' },
                  { id: 'algo', label: '📈 Arbitraj' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => runCommand(btn.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      activeCommand === btn.id
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Terminal Screen Output */}
            <div className="p-6 text-xs text-slate-300 space-y-2 min-h-[260px] max-h-[300px] overflow-y-auto bg-slate-950/70">
              {terminalOutput.map((line, idx) => (
                <div key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-cyan-400 font-bold select-none">&gt;</span>
                  <span className={line.includes('✓') ? 'text-emerald-400 font-bold' : line.includes('$') ? 'text-cyan-300 font-bold' : 'text-slate-300'}>
                    {line}
                  </span>
                </div>
              ))}
              {isSimulating && (
                <div className="flex items-center gap-2 text-amber-400 animate-pulse">
                  <span>[PROCESSING] Komut yürütülüyor...</span>
                </div>
              )}
            </div>

            {/* Terminal Footer */}
            <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Root Privileges Granted
              </span>
              <span>256-Bit SSL Shell Session</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
