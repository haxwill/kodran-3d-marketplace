import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero3D } from './components/Hero3D';
import { IntegrationsBar } from './components/IntegrationsBar';
import { ProductGrid } from './components/ProductGrid';
import { WorkflowSteps } from './components/WorkflowSteps';
import { EnterpriseOverview } from './components/EnterpriseOverview';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CustomOrderModal } from './components/CustomOrderModal';
import { LoginModal } from './components/LoginModal';
import { ToastContainer } from './components/Toast';
import { Flame, ShieldAlert, KeyRound } from 'lucide-react';

function AppContent() {
  const { currentView, flashSaleSettings, securitySettings, user, setIsLoginModalOpen, language } = useStore();

  // If Maintenance mode is active and user is not an admin
  if (securitySettings?.maintenanceMode && currentView !== 'admin' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {language === 'EN' ? 'System Under Maintenance' : 'Sistem Bakım Modunda'}
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              {securitySettings.maintenanceMessage || (language === 'EN' ? 'KODRAN.DEV is currently undergoing infrastructure upgrades.' : 'KODRAN.DEV altyapısı güncelleniyor. Çok yakında yeni özelliklerle yayındayız.')}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-indigo-400" />
              <span>{language === 'EN' ? 'Admin Access Portal' : 'Yönetici Girişi (Admin)'}</span>
            </button>
          </div>
        </div>

        <LoginModal />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-indigo-600 selection:text-white font-sans">
      
      {/* Top Sitewide Flash Sale Banner */}
      {flashSaleSettings?.isEnabled && (
        <div className="bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-600 text-white text-xs font-bold py-2.5 px-4 text-center flex flex-wrap items-center justify-center gap-2 shadow-sm sticky top-0 z-40 animate-in slide-in-from-top duration-300">
          <Flame className="w-4 h-4 fill-amber-200 text-amber-200 animate-bounce" />
          <span>{typeof flashSaleSettings.title === 'object' ? (flashSaleSettings.title[language] || flashSaleSettings.title.TR) : (flashSaleSettings.title || '⚡ Sınırlı Süre Flaş İndirim Kampanyası')}</span>
          <span className="bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase">
            %{flashSaleSettings.discountPercent} İndirim Sepete Yansıtıldı
          </span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'admin' ? (
          <AdminDashboard />
        ) : (
          <>
            <Hero3D />
            <IntegrationsBar />
            <ProductGrid />
            <WorkflowSteps />
            <EnterpriseOverview />
            <Testimonials />
            <FAQ />
            <CTASection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <LoginModal />
      <ProductModal />
      <CartDrawer />
      <CustomOrderModal />
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
