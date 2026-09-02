import React, { useRef, useState } from 'react';
import { useStore, CURRENCY_SYMBOLS } from '../context/StoreContext';
import { getLocalizedProduct } from '../utils/translations';
import { 
  Star, 
  ShoppingBag, 
  Eye, 
  Sparkles, 
  Bot,
  DatabaseZap,
  Layers,
  Globe,
  Terminal,
  Search,
  Cpu,
  Check,
  TrendingUp,
  Radio
} from 'lucide-react';
import { soundFX } from '../utils/audio';

const iconMap = {
  Bot,
  DatabaseZap,
  Layers,
  Globe,
  Terminal,
  Search,
  Cpu,
  TrendingUp
};

export const ProductCard = ({ product }) => {
  const { 
    currency, 
    getProductPrice, 
    addToCart, 
    setSelectedProduct,
    language 
  } = useStore();

  const prod = getLocalizedProduct(product, language);
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const IconComponent = iconMap[prod.icon] || Cpu;
  const currentPrice = getProductPrice(prod);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12;
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    soundFX.playClick();
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${
          isHovered ? 'scale3d(1.03, 1.03, 1.03) translateY(-4px)' : 'scale3d(1, 1, 1)'
        }`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
      }}
      className="relative rounded-3xl glass-card p-6 flex flex-col justify-between overflow-hidden group select-none border border-slate-200/90 shadow-xl shadow-slate-900/5 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 transform-style-3d"
    >
      {/* Dynamic 3D Glare Lighting Effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(99, 102, 241, 0.12) 0%, transparent 60%)`,
        }}
      />

      {/* Top Layer 3D Badge (translateZ for real physical depth) */}
      <div style={{ transform: isHovered ? 'translateZ(30px)' : 'translateZ(0px)', transition: 'transform 0.3s' }}>
        <div className="flex items-center justify-between gap-2 mb-4">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70 shadow-xs">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            {prod.badge}
          </span>

          {/* Rating & Sales */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium font-mono">
            <div className="flex items-center gap-0.5 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{prod.rating}</span>
            </div>
            <span>•</span>
            <span>{prod.salesCount} {language === 'EN' ? 'Deploys' : 'Dağıtım'}</span>
          </div>
        </div>

        {/* 3D Visual Icon Core Block */}
        <div 
          style={{ transform: isHovered ? 'translateZ(40px)' : 'translateZ(0px)', transition: 'transform 0.3s' }}
          className="relative mb-5 w-full h-36 rounded-2xl bg-gradient-to-tr from-slate-50 via-indigo-50/30 to-cyan-50/30 border border-slate-100 flex items-center justify-center overflow-hidden group-hover:border-indigo-200 transition-colors shadow-inner"
        >
          {/* Cyber matrix rings in 3D card background */}
          <div className="absolute w-28 h-28 rounded-full border border-indigo-200/50 border-dashed animate-spin-slow" />
          <div className="absolute w-40 h-40 rounded-full border border-cyan-200/40" />

          {/* Central 3D Floating Icon with Shadow */}
          <div 
            className="relative w-16 h-16 rounded-2xl bg-white shadow-xl shadow-indigo-950/10 border border-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 z-10"
            style={{ color: prod.accentColor }}
          >
            <IconComponent className="w-8 h-8" />
          </div>

          {/* Supported OS pill on corner */}
          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-lg bg-white/90 backdrop-blur-sm border border-slate-200 text-[10px] font-mono font-bold text-slate-700 shadow-xs">
            {prod.techStack?.[0]}
          </div>

          <div className="absolute top-2.5 left-2.5 text-[9px] font-mono text-slate-400">
            AETH-{prod.id?.slice(0, 4).toUpperCase()}
          </div>
        </div>

        {/* Title and Subtitle */}
        <h3 
          onClick={() => {
            setSelectedProduct(prod);
            soundFX.playLaser();
          }}
          className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1 mb-1.5"
        >
          {prod.title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
          {prod.subtitle}
        </p>

        {/* Key Features Pill list */}
        <div className="space-y-1.5 mb-6">
          {(prod.specs || []).slice(0, 3).map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="line-clamp-1">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer: Price and Actions (translateZ for physical depth) */}
      <div 
        style={{ transform: isHovered ? 'translateZ(25px)' : 'translateZ(0px)', transition: 'transform 0.3s' }}
        className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3"
      >
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-wider">
            {language === 'EN' ? 'Base License' : 'Taban Lisans'}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {CURRENCY_SYMBOLS[currency]}{currentPrice.toLocaleString('tr-TR')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Inspect Modal Button */}
          <button
            onClick={() => {
              setSelectedProduct(prod);
              soundFX.playLaser();
            }}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-indigo-600 transition-colors shadow-xs cursor-pointer"
            title={language === 'EN' ? 'Inspect 3D Code & Architecture' : '3D Kod ve Mimari İncele'}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={() => {
              addToCart(prod);
              soundFX.playLaser();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-slate-900/10 hover:shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language === 'EN' ? 'Add to Cart' : 'Sepete Ekle'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
