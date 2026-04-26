import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const delivery = cartTotal >= 5000 ? 0 : 490;
  const total = cartTotal + delivery;

  const handleCheckout = () => {
    if (!user) { navigate('/login'); return; }
    clearCart();
    toast('Заказ успешно оформлен! Спасибо!');
    navigate('/orders');
  };

  if (cart.length === 0) return (
    <div className="page-pad container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛍</div>
      <h2 style={{ marginBottom: '0.75rem' }}>Корзина пуста</h2>
      <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>Добавьте что-нибудь из каталога</p>
      <Link to="/products" className="btn btn-primary">Перейти в каталог</Link>
    </div>
  );

  return (
    <div className="page-pad container" style={{ padding: '5rem 2rem 4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Корзина <span style={{ color: 'var(--gray-400)', fontSize: '1.2rem', fontFamily: 'DM Sans, sans-serif', fontWeight: 400 }}>({cart.reduce((s, i) => s + i.qty, 0)} товара)</span></h1>
        <button onClick={() => { clearCart(); toast('Корзина очищена', 'warning'); }} style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>Очистить</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.map(item => (
            <div key={item.key} style={{ display: 'flex', gap: '1.25rem', background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 12, padding: '1.25rem', alignItems: 'center' }}>
              <Link to={`/products/${item.id}`}>
                <img src={item.image} alt={item.name} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 8, background: 'var(--gray-50)' }} />
              </Link>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{item.brand}</div>
                <Link to={`/products/${item.id}`} style={{ fontWeight: 600, fontSize: '0.95rem', display: 'block', marginBottom: '0.25rem' }}>{item.name}</Link>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>Размер: <strong>{item.size}</strong></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => updateQty(item.key, item.qty - 1)} style={{ width: 32, height: 32, border: '1.5px solid var(--gray-200)', borderRadius: 6, background: 'none', cursor: 'pointer', fontSize: '1rem' }}>−</button>
                <span style={{ width: 32, textAlign: 'center', fontWeight: 700 }}>{item.qty}</span>
                <button onClick={() => updateQty(item.key, item.qty + 1)} style={{ width: 32, height: 32, border: '1.5px solid var(--gray-200)', borderRadius: 6, background: 'none', cursor: 'pointer', fontSize: '1rem' }}>+</button>
              </div>
              <div style={{ textAlign: 'right', minWidth: 100 }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{(item.price * item.qty).toLocaleString('ru-RU')} ₽</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>{item.price.toLocaleString('ru-RU')} ₽/шт</div>
              </div>
              <button onClick={() => { removeFromCart(item.key); toast('Товар удалён', 'warning'); }} style={{ background: 'none', border: 'none', color: 'var(--gray-300)', cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem' }}>✕</button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 12, padding: '1.75rem', position: 'sticky', top: 'calc(var(--nav-h) + 1rem)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Итого</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--gray-600)' }}>Товары</span>
              <span>{cartTotal.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--gray-600)' }}>Доставка</span>
              <span style={{ color: delivery === 0 ? 'var(--green)' : 'var(--black)' }}>{delivery === 0 ? 'Бесплатно' : `${delivery} ₽`}</span>
            </div>
            {delivery > 0 && <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', background: 'var(--gray-50)', padding: '0.5rem 0.75rem', borderRadius: 6 }}>Бесплатная доставка от 5 000 ₽</div>}
          </div>
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>
            <span>Итого</span>
            <span>{total.toLocaleString('ru-RU')} ₽</span>
          </div>
          <button className="btn btn-primary" onClick={handleCheckout} style={{ width: '100%', fontSize: '0.85rem' }}>
            {user ? 'Оформить заказ' : 'Войти и оформить'}
          </button>
          <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--gray-600)' }}>← Продолжить покупки</Link>
        </div>
      </div>
      <style>{`@media(max-width:900px){div[style*="360px"]{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}
