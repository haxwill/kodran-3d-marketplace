import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  Play, 
  RotateCcw, 
  Sparkles,
  Layers,
  HelpCircle,
  Copy,
  Radio,
  Cpu
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { soundFX } from '../utils/audio';

export const TerminalDemo = () => {
  const { addToast } = useStore();
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    { text: 'AETHERIS // QUANTUM CORE CLI v4.8.2 [ONLINE]', type: 'info' },
    { text: 'Sistem belleği ayrıldı: 256MB VRAM • Sıfır Gecikmeli Bot Ağı Hazır.', type: 'muted' },
    { text: 'Kullanılabilir komutlar için "help" yazınız veya aşağıdaki butonları kullanınız.', type: 'highlight' },
  ]);
  const [isBusy, setIsBusy] = useState(false);
  const terminalEndRef = useRef(null);

  const commands = [
    { cmd: 'help', label: 'Yardım (help)', desc: 'Tüm komutları listeler' },
    { cmd: 'scrape trendyol', label: 'E-Ticaret Kazıma', desc: 'Canlı ürün çekme testi' },
    { cmd: 'bot start', label: 'AI Botu Başlat', desc: 'Telegram/WA asistanı' },
    { cmd: 'arbitrage scan', label: 'Borsa Arbitraj', desc: 'Anlık spread taraması' },
    { cmd: 'aetheris auth', label: 'SaaS Token Doğrula', desc: 'JWT & Rol doğrulaması' },
    { cmd: 'clear', label: 'Temizle', desc: 'Terminali sıfırlar' },
  ];

  const handleCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    soundFX.playLaser();
    setHistory((prev) => [...prev, { text: `> ${rawCmd}`, type: 'user' }]);
    setInputVal('');

    if (cmd === 'clear') {
      setHistory([
        { text: 'AETHERIS.DEV Quantum CLI [Terminal Sıfırlandı]', type: 'info' }
      ]);
      return;
    }

    if (cmd === 'help') {
      setHistory((prev) => [
        ...prev,
        { text: 'AETHERIS Otonom Komut Kütüphanesi:', type: 'highlight' },
        { text: '  - scrape [hedef]   : Anti-bot bypass ile hedef siteden veri çeker.', type: 'text' },
        { text: '  - bot start        : Çok kanallı AI asistanını aktif eder.', type: 'text' },
        { text: '  - arbitrage scan   : 10+ kripto borsasında milisaniyelik kâr tarar.', type: 'text' },
        { text: '  - aetheris auth    : SaaS mimarisi API yanıtını simüle eder.', type: 'text' },
        { text: '  - clear            : Terminal ekranını temizler.', type: 'text' },
      ]);
      return;
    }

    setIsBusy(true);

    if (cmd.startsWith('scrape')) {
      const site = cmd.split(' ')[1] || 'hedef site';
      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { text: `[PROXY-POOL] 48 Residential IP havuzuna dinamik bağlanıldı.`, type: 'info' },
          { text: `[FINGERPRINT] Cloudflare Turnstile & Datadome maskelendi (Bypass %100).`, type: 'highlight' },
          { text: `[SUCCESS] 3,820 adet ürün verisi "${site}" üzerinden 1.2 saniyede çekildi!`, type: 'success' },
          { text: `[EXPORT] JSON, CSV ve PostgreSQL tablolarına aktarım tamamlandı.`, type: 'success' },
        ]);
        setIsBusy(false);
      }, 650);
      return;
    }

    if (cmd.startsWith('bot')) {
      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { text: `[AI-AGENT] WhatsApp & Telegram Webhook dinleyicisi aktif edildi.`, type: 'info' },
          { text: `[RAG-VECTOR] 1,450 döküman Pinecone/Qdrant hafızasına yüklendi.`, type: 'highlight' },
          { text: `[ONLINE] Ajan müşterilerinizi 7/24 insan gibi yanıtlamaya başladı!`, type: 'success' },
        ]);
        setIsBusy(false);
      }, 600);
      return;
    }

    if (cmd.startsWith('arbitrage')) {
      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { text: `[WEBSOCKET] Binance, Bybit ve OKX emir defterleri taranıyor...`, type: 'info' },
          { text: `[FIRSAT] SOL/USDT spread: %1.24 (Tahmini Net Kâr: $112.50)`, type: 'highlight' },
          { text: `[EXECUTION] Flash loan arbitraj işlemi simüle edildi ve onaylandı.`, type: 'success' },
        ]);
        setIsBusy(false);
      }, 600);
      return;
    }

    if (cmd.startsWith('aetheris') || cmd.startsWith('saas')) {
      setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { text: `[AUTH] Aetheris JWT Token üretildi (Yetki: QUANTUM_ADMIN)`, type: 'info' },
          { text: `[SUBSCRIPTION] Plan: ENTERPRISE_PRO ($149/ay) Aktif.`, type: 'success' },
          { text: `[API-GATEWAY] 200 OK - Dashboard veritabanı uçları bağlandı.`, type: 'highlight' },
        ]);
        setIsBusy(false);
      }, 500);
      return;
    }

    // Default unknown command
    setTimeout(() => {
      setHistory((prev) => [
        ...prev,
        { text: `Komut bulunamadı: "${rawCmd}". Komut listesini görmek için "help" yazın.`, type: 'error' },
      ]);
      setIsBusy(false);
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    }
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  return (
    <section id="terminal" className="py-24 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold border border-cyan-200/60 mb-3">
            <Radio className="w-3.5 h-3.5 text-cyan-600" />
            İnteraktif Geliştirici Laboratuvarı
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Canlı Kod & Otomasyon Terminali
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Geliştirdiğimiz otonom botların ve veri kazıma algoritmalarının nasıl çalıştığını doğrudan tarayıcınızdan interaktif olarak test edin.
          </p>
        </div>

        {/* Terminal Container */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl shadow-indigo-950/20 overflow-hidden">
          
          {/* Terminal Window Header Bar */}
          <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
              <span className="ml-3 text-xs font-mono text-slate-400 flex items-center gap-2">
                <span className="text-indigo-400 font-bold">aetheris@quantum-cli:</span> ~/core-engine
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE 60 FPS
              </span>
            </div>
          </div>

          {/* Preset Command Quick Chips */}
          <div className="px-5 py-2.5 bg-slate-900/50 border-b border-slate-800/70 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap font-bold">Hızlı Komutlar:</span>
            {commands.map((c) => (
              <button
                key={c.cmd}
                onClick={() => handleCommand(c.cmd)}
                disabled={isBusy}
                className="px-3 py-1 rounded-lg bg-slate-800/90 hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-mono transition-all whitespace-nowrap disabled:opacity-50 border border-slate-700/60 shadow-xs"
              >
                ${c.cmd}
              </button>
            ))}
          </div>

          {/* Terminal Output Log Area */}
          <div className="p-6 font-mono text-xs sm:text-sm min-h-[300px] max-h-[400px] overflow-y-auto space-y-2">
            {history.map((line, idx) => {
              let color = 'text-slate-300';
              if (line.type === 'user') color = 'text-cyan-400 font-bold';
              else if (line.type === 'info') color = 'text-indigo-300';
              else if (line.type === 'highlight') color = 'text-amber-300';
              else if (line.type === 'success') color = 'text-emerald-400 font-semibold';
              else if (line.type === 'error') color = 'text-rose-400';
              else if (line.type === 'muted') color = 'text-slate-500';

              return (
                <div key={idx} className={`${color} leading-relaxed break-words`}>
                  {line.text}
                </div>
              );
            })}

            {isBusy && (
              <div className="text-cyan-400 flex items-center gap-2">
                <span className="animate-spin">⚙️</span>
                <span>Komut kuantum çekirdeğinde işleniyor...</span>
              </div>
            )}

            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Interactive Input Line */}
          <div className="p-4 bg-slate-900/95 border-t border-slate-800 flex items-center gap-3">
            <span className="text-emerald-400 font-mono font-bold text-sm select-none">
              aetheris@core:~$
            </span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isBusy}
              placeholder="Bir komut yazın (örn: scrape trendyol, bot start, help)..."
              className="flex-1 bg-transparent font-mono text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
            />
            <button
              onClick={() => handleCommand(inputVal)}
              disabled={isBusy || !inputVal.trim()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-40 shadow-md shadow-indigo-600/30"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Çalıştır</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
