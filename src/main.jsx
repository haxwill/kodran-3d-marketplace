import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Clear stale localStorage data that causes object-as-React-child crashes
try {
  const savedProducts = localStorage.getItem('kodran_products');
  if (savedProducts) {
    const parsed = JSON.parse(savedProducts);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const firstProduct = parsed[0];
      // If the title is an object {TR, EN} in localStorage, it means stale data
      if (firstProduct.title && typeof firstProduct.title === 'object') {
        console.warn('[KODRAN] Stale localStorage detected — clearing cached products.');
        localStorage.removeItem('kodran_products');
      }
    }
  }
} catch (e) {
  localStorage.removeItem('kodran_products');
}

// Global Error Boundary for white-screen prevention
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[KODRAN] React Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#0f172a',
          color: '#e2e8f0',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Uygulama Hatası Yakalandı
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '500px', marginBottom: '1.5rem' }}>
            {this.state.error?.message || 'Bilinmeyen hata'}
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '1rem',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            🔄 Sıfırla ve Yeniden Başlat
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
