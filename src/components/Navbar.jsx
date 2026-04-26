import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount, wishlist } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      height: 'var(--nav-h)',
      background: scrolled ? 'rgba(250,250,250,0.97)' : '#fafafa',
      borderBottom: '1px solid var(--gray-100)',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      transition: 'all 0.3s',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none'
    }}>
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em' }}>LUXE</span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', marginBottom: 2 }}></span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          {[['/', 'Главная'], ['/products', 'Каталог'], ['/products?cat=Кроссовки', 'Кроссовки'], ['/products?cat=Одежда', 'Одежда']].map(([to, label]) => (
            <Link key={to} to={to} style={{
              fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: location.pathname === to ? 'var(--accent)' : 'var(--gray-600)',
              transition: 'color 0.2s'
            }}>{label}</Link>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Wishlist */}
          <Link to="/wishlist" style={{ position: 'relative', color: 'var(--gray-600)', fontSize: '1.2rem' }} title="Избранное">
            ♡
            {wishlist.length > 0 && <span style={{ position: 'absolute', top: -6, right: -6, background: 'var(--red)', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{wishlist.length}</span>}
          </Link>

          {/* Cart */}
          <Link to="/cart" style={{ position: 'relative', color: 'var(--black)', fontSize: '1.2rem' }} title="Корзина">
            🛍
            {cartCount > 0 && <span style={{ position: 'absolute', top: -6, right: -6, background: 'var(--accent)', color: 'var(--black)', borderRadius: '50%', width: 18, height: 18, fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{cartCount}</span>}
          </Link>

          {/* User Menu */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1.5px solid var(--gray-200)',
                borderRadius: '100px', padding: '0.4rem 0.9rem 0.4rem 0.5rem', cursor: 'pointer', transition: 'border-color 0.2s'
              }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', color: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 500, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
              </button>
              {userMenuOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0, background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', minWidth: 180, overflow: 'hidden' }}>
                  {[
                    ['/profile', '👤 Профиль'],
                    ['/dashboard', '📊 Дашборд'],
                    ...(isAdmin ? [['/admin', '⚙️ Админ панель']] : []),
                    ['/orders', '📦 Заказы'],
                  ].map(([to, label]) => (
                    <Link key={to} to={to} style={{ display: 'block', padding: '0.75rem 1.25rem', fontSize: '0.875rem', color: 'var(--gray-800)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.target.style.background = 'var(--gray-50)'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}
                    >{label}</Link>
                  ))}
                  <div style={{ borderTop: '1px solid var(--gray-100)' }}>
                    <button onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.75rem 1.25rem', fontSize: '0.875rem', color: 'var(--red)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      ← Выйти
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-ghost" style={{ padding: '0.5rem 1.1rem', fontSize: '0.75rem' }}>Войти</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.75rem' }}>Регистрация</Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn" style={{ background: 'none', border: 'none', fontSize: '1.5rem', display: 'none', color: 'var(--black)' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: 'var(--white)', borderTop: '1px solid var(--gray-100)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[['/', 'Главная'], ['/products', 'Каталог'], ['/products?cat=Кроссовки', 'Кроссовки'], ['/products?cat=Одежда', 'Одежда']].map(([to, label]) => (
            <Link key={to} to={to} style={{ fontSize: '0.9rem', fontWeight: 500, padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)' }}>{label}</Link>
          ))}
          {!user ? (
            <>
              <Link to="/login" style={{ fontSize: '0.9rem', padding: '0.5rem 0' }}>Войти</Link>
              <Link to="/register" style={{ fontSize: '0.9rem', padding: '0.5rem 0' }}>Регистрация</Link>
            </>
          ) : (
            <>
              <Link to="/profile" style={{ fontSize: '0.9rem', padding: '0.5rem 0' }}>Профиль</Link>
              <button onClick={handleLogout} style={{ textAlign: 'left', background: 'none', border: 'none', fontSize: '0.9rem', padding: '0.5rem 0', color: 'var(--red)' }}>Выйти</button>
            </>
          )}
        </div>
      )}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
