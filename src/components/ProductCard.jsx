import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist, addToCart } = useCart();
  const { toast } = useToast();
  const inWish = isInWishlist(product.id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes?.[0];
    if (!size) return;
    addToCart(product, size);
    toast(`${product.name} добавлен в корзину`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast(inWish ? 'Удалено из избранного' : 'Добавлено в избранное', inWish ? 'warning' : 'success');
  };

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="card" style={{ position: 'relative' }}>
        {/* Image */}
        <div style={{ position: 'relative', paddingBottom: '100%', overflow: 'hidden', background: 'var(--gray-50)' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
          {/* Badges */}
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {product.isNew && <span className="badge badge-new">New</span>}
            {product.isSale && <span className="badge badge-sale">-{discount}%</span>}
          </div>
          {/* Wishlist btn */}
          <button onClick={handleWishlist} style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', cursor: 'pointer', transition: 'transform 0.2s',
            color: inWish ? 'var(--red)' : 'var(--gray-400)'
          }}>
            {inWish ? '♥' : '♡'}
          </button>
          {/* Quick add overlay */}
          <div className="quick-add-overlay" style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'rgba(10,10,10,0.85)', padding: '0.75rem',
            transform: 'translateY(100%)', transition: 'transform 0.3s',
            display: 'flex', justifyContent: 'center'
          }}>
            <button onClick={handleQuickAdd} style={{
              background: 'var(--accent)', border: 'none', color: 'var(--black)',
              padding: '0.5rem 1.5rem', borderRadius: 6, fontWeight: 700,
              fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer'
            }}>Быстрый заказ</button>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.25rem' }}>
            {product.brand}
          </div>
          <div style={{ fontWeight: 500, fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--gray-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.6rem' }}>
            <span className="star" style={{ fontSize: '0.8rem' }}>★</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>{product.rating} ({product.reviews})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {product.oldPrice && <span className="price-old">{product.oldPrice.toLocaleString('ru-RU')} ₽</span>}
            <span className={`price ${product.isSale ? 'price-sale' : ''}`}>{product.price.toLocaleString('ru-RU')} ₽</span>
          </div>
          {/* Gender */}
          <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {product.gender} · {product.category}
          </div>
        </div>
      </div>
      <style>{`.card:hover .quick-add-overlay { transform: translateY(0) !important; }`}</style>
    </Link>
  );
}
