import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const monthlyData = [
  { month: 'Янв', orders: 4, spent: 28000 }, { month: 'Фев', orders: 2, spent: 15000 },
  { month: 'Мар', orders: 7, spent: 56000 }, { month: 'Апр', orders: 3, spent: 22000 },
  { month: 'Май', orders: 9, spent: 89000 }, { month: 'Июн', orders: 5, spent: 43000 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { cart, wishlist, cartTotal } = useCart();
  const { products } = useProducts();

  const stats = [
    { label: 'В корзине', value: cart.reduce((s, i) => s + i.qty, 0), icon: '🛍', color: 'var(--accent)' },
    { label: 'Избранное', value: wishlist.length, icon: '♥', color: 'var(--red)' },
    { label: 'Сумма корзины', value: cartTotal.toLocaleString('ru-RU') + ' ₽', icon: '💰', color: 'var(--green)' },
    { label: 'Просмотрено', value: products.length, icon: '👁', color: '#8b5cf6' },
  ];

  const catStats = ['Кроссовки', 'Футболки', 'Худи', 'Джинсы', 'Куртки'].map(cat => ({
    cat, count: products.filter(p => p.category === cat).length
  }));

  return (
    <div className="page-pad container" style={{ padding: '5rem 2rem 4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ color: 'var(--gray-400)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>Личный кабинет</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>Привет, {user?.name?.split(' ')[0]}! 👋</h1>
        <p style={{ color: 'var(--gray-600)', marginTop: '0.5rem' }}>{new Date().toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {stats.map(({ label, value, icon, color }) => (
          <div key={label} style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 12, padding: '1.5rem', transition: 'box-shadow 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{icon}</div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gray-400)', marginBottom: '0.4rem' }}>{label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Playfair Display, serif', color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 12, padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--gray-800)' }}>Активность по месяцам</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v} заказов`]} />
              <Bar dataKey="orders" fill="#c9a96e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 12, padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--gray-800)' }}>Расходы (₽)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v.toLocaleString()} ₽`]} />
              <Line type="monotone" dataKey="spent" stroke="#0a0a0a" strokeWidth={2} dot={{ fill: '#c9a96e', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category breakdown */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 12, padding: '1.5rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Категории товаров в каталоге</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {catStats.map(({ cat, count }) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ width: 100, fontSize: '0.85rem', color: 'var(--gray-600)' }}>{cat}</span>
              <div style={{ flex: 1, height: 8, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(count / products.length) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: 4, transition: 'width 0.5s' }} />
              </div>
              <span style={{ width: 30, fontSize: '0.85rem', fontWeight: 700, textAlign: 'right' }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {[['Каталог', '/products', '👟'], ['Корзина', '/cart', '🛍'], ['Избранное', '/wishlist', '♥'], ['Профиль', '/profile', '👤'], ['Заказы', '/orders', '📦']].map(([label, to, icon]) => (
          <Link key={to} to={to} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--gray-50)', border: '1px solid var(--gray-100)', borderRadius: 10, padding: '1rem 1.25rem', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--black)'; e.currentTarget.style.color = 'var(--white)'; e.currentTarget.style.borderColor = 'var(--black)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--gray-50)'; e.currentTarget.style.color = 'var(--black)'; e.currentTarget.style.borderColor = 'var(--gray-100)'; }}>
            <span style={{ fontSize: '1.2rem' }}>{icon}</span>
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{label}</span>
          </Link>
        ))}
      </div>
      <style>{`@media(max-width:768px){div[style*="1fr 1fr"]{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}
