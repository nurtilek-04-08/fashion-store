import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            background: t.type === 'error' ? '#1a0a0a' : t.type === 'warning' ? '#1a1200' : '#0a1a0a',
            color: t.type === 'error' ? '#ff6b6b' : t.type === 'warning' ? '#ffd93d' : '#6bcb77',
            border: `1px solid ${t.type === 'error' ? '#ff6b6b33' : t.type === 'warning' ? '#ffd93d33' : '#6bcb7733'}`,
            fontSize: '0.875rem',
            fontWeight: 500,
            animation: 'slideIn 0.3s ease',
            maxWidth: '320px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>{t.type === 'error' ? '✕' : t.type === 'warning' ? '⚠' : '✓'}</span>
            {t.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn { from { opacity:0; transform: translateX(1rem); } to { opacity:1; transform: translateX(0); } }`}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
