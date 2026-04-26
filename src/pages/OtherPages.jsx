import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';

export function WishlistPage() {
  const { wishlist, toggleWishlist } = useCart();
  const { toast } = useToast();

  return (
    <div className="page-pad container" style={{ padding: '5rem 2rem 4rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Избранное <span style={{ color: 'var(--gray-400)', fontSize: '1.2rem', fontFamily: 'DM Sans, sans-serif', fontWeight: 400 }}>({wishlist.length})</span></h1>
      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>♡</div>
          <h3 style={{ marginBottom: '0.5rem' }}>Список избранного пуст</h3>
          <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>Сохраняйте понравившиеся товары</p>
          <Link to="/products" className="btn btn-primary">Перейти в каталог</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {wishlist.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

const MOCK_ORDERS = [
  { id: 'ORD-2025-001', date: '2025-04-10', status: 'Доставлен', total: 28490, items: [{ name: 'Air Max 270', brand: 'Nike', qty: 1, price: 12990, size: '42' }, { name: 'Trefoil Hoodie', brand: 'Adidas', qty: 1, price: 7500, size: 'M' }] },
  { id: 'ORD-2025-002', date: '2025-05-02', status: 'В пути', total: 15990, items: [{ name: 'Windbreaker Jacket', brand: 'Nike', qty: 1, price: 15990, size: 'L' }] },
  { id: 'ORD-2025-003', date: '2025-05-18', status: 'Обрабатывается', total: 8990, items: [{ name: 'Logo Polo Shirt', brand: 'Polo Ralph Lauren', qty: 1, price: 12500, size: 'M' }] },
];

const STATUS_COLORS = { 'Доставлен': { bg: '#f0fff4', color: '#276749', border: '#c6f6d5' }, 'В пути': { bg: '#fffbeb', color: '#92400e', border: '#fde68a' }, 'Обрабатывается': { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' } };

export function OrdersPage() {
  return (
    <div className="page-pad container" style={{ padding: '5rem 2rem 4rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Мои заказы</h1>
      {MOCK_ORDERS.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ marginBottom: '0.5rem' }}>Заказов пока нет</h3>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Начать покупки</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {MOCK_ORDERS.map(order => {
            const sc = STATUS_COLORS[order.status] || {};
            return (
              <div key={order.id} style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--gray-100)', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{order.id}</span>
                    <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem', marginLeft: '1rem' }}>{new Date(order.date).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, borderRadius: 100, padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 700 }}>{order.status}</span>
                    <span style={{ fontWeight: 800, fontFamily: 'Playfair Display, serif' }}>{order.total.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
                <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <div>
                        <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.75rem', marginRight: '0.5rem' }}>{item.brand}</span>
                        <span style={{ fontWeight: 500 }}>{item.name}</span>
                        <span style={{ color: 'var(--gray-400)', marginLeft: '0.5rem' }}>· размер {item.size} · {item.qty} шт</span>
                      </div>
                      <span style={{ fontWeight: 600 }}>{item.price.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(6rem, 20vw, 12rem)', fontWeight: 700, lineHeight: 1, color: 'var(--gray-100)' }}>404</div>
        <h2 style={{ marginBottom: '0.75rem', marginTop: '-1rem' }}>Страница не найдена</h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>Возможно, страница была удалена или вы ввели неверный адрес</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">На главную</Link>
          <Link to="/products" className="btn btn-ghost">Каталог</Link>
        </div>
      </div>
    </div>
  );
}
