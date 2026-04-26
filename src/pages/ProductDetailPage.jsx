import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { getById, getRelated } = useProducts();
  const product = getById(id);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('desc');
  const [sizeError, setSizeError] = useState(false);

  if (!product) return (
    <div style={{ paddingTop: 'var(--nav-h)', textAlign: 'center', padding: '10rem 2rem' }}>
      <h2>Товар не найден</h2>
      <Link to="/products" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Вернуться в каталог</Link>
    </div>
  );

  const related = getRelated(product);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const isCategory = product.category === 'Кроссовки' || product.category === 'Носки';
  const sizes = isCategory ? product.sizes : product.sizes;

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addToCart(product, selectedSize, qty);
    toast(`${product.name} (размер ${selectedSize}) добавлен в корзину!`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) { setSizeError(true); return; }
    if (!user) { navigate('/login'); return; }
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="page-pad" style={{ paddingTop: 'calc(var(--nav-h) + 2rem)' }}>
      {/* Breadcrumbs */}
      <div className="container" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--gray-400)' }}>
          <Link to="/" style={{ color: 'var(--gray-400)' }}>Главная</Link>
          <span>/</span>
          <Link to="/products" style={{ color: 'var(--gray-400)' }}>Каталог</Link>
          <span>/</span>
          <Link to={`/products?cat=${product.category}`} style={{ color: 'var(--gray-400)' }}>{product.category}</Link>
          <span>/</span>
          <span style={{ color: 'var(--black)' }}>{product.name}</span>
        </div>
      </div>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
        {/* Image */}
        <div>
          <div style={{ background: 'var(--gray-50)', borderRadius: 16, overflow: 'hidden', position: 'relative', aspectRatio: '1' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {product.isSale && <div style={{ position: 'absolute', top: 16, left: 16 }}><span className="badge badge-sale" style={{ fontSize: '0.9rem', padding: '0.3rem 0.8rem' }}>−{discount}%</span></div>}
            {product.isNew && <div style={{ position: 'absolute', top: product.isSale ? 52 : 16, left: 16 }}><span className="badge badge-new" style={{ fontSize: '0.9rem', padding: '0.3rem 0.8rem' }}>NEW</span></div>}
            {/* Wishlist */}
            <button onClick={() => { toggleWishlist(product); toast(isInWishlist(product.id) ? 'Удалено из избранного' : 'Добавлено в избранное'); }}
              style={{ position: 'absolute', top: 16, right: 16, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', fontSize: '1.3rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isInWishlist(product.id) ? 'var(--red)' : 'var(--gray-400)' }}>
              {isInWishlist(product.id) ? '♥' : '♡'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Link to={`/products?brand=${product.brand}`} style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.5rem' }}>
            {product.brand}
          </Link>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: '0.75rem' }}>{product.name}</h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= Math.round(product.rating) ? 'var(--accent)' : 'var(--gray-200)', fontSize: '1rem' }}>★</span>)}
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>{product.rating} · {product.reviews} отзывов</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {product.oldPrice && <span className="price-old" style={{ fontSize: '1.1rem' }}>{product.oldPrice.toLocaleString('ru-RU')} ₽</span>}
            <span style={{ fontSize: '2rem', fontWeight: 800, color: product.isSale ? 'var(--red)' : 'var(--black)', fontFamily: 'Playfair Display, serif' }}>{product.price.toLocaleString('ru-RU')} ₽</span>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 6, padding: '0.25rem 0.75rem', color: 'var(--gray-600)' }}>{product.gender}</span>
            <span style={{ fontSize: '0.75rem', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 6, padding: '0.25rem 0.75rem', color: 'var(--gray-600)' }}>{product.category}</span>
            {product.colors?.map(c => <span key={c} style={{ fontSize: '0.75rem', background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 6, padding: '0.25rem 0.75rem', color: 'var(--accent-dark)' }}>{c}</span>)}
          </div>

          <div className="divider" style={{ margin: '0 0 1.5rem' }} />

          {/* Size selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: sizeError ? 'var(--red)' : 'var(--gray-600)' }}>
                {sizeError ? '⚠ Выберите размер' : 'Выберите размер'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent)', cursor: 'pointer' }}>Таблица размеров</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {sizes.map(size => (
                <button key={size} onClick={() => { setSelectedSize(size); setSizeError(false); }} style={{
                  minWidth: 50, padding: '0.5rem 0.75rem', border: `1.5px solid ${selectedSize === size ? 'var(--black)' : sizeError ? 'var(--red)' : 'var(--gray-200)'}`,
                  borderRadius: 8, fontSize: '0.875rem', fontWeight: selectedSize === size ? 700 : 400,
                  background: selectedSize === size ? 'var(--black)' : 'transparent',
                  color: selectedSize === size ? 'var(--white)' : 'var(--black)', cursor: 'pointer', transition: 'all 0.15s'
                }}>{size}</button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray-600)' }}>Количество</span>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--gray-200)', borderRadius: 8, overflow: 'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, border: 'none', background: 'var(--gray-50)', cursor: 'pointer', fontSize: '1.1rem' }}>−</button>
              <span style={{ width: 48, textAlign: 'center', fontWeight: 700 }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ width: 40, height: 40, border: 'none', background: 'var(--gray-50)', cursor: 'pointer', fontSize: '1.1rem' }}>+</button>
            </div>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
            <button className="btn btn-primary" onClick={handleAddToCart} style={{ flex: 1 }}>В корзину 🛍</button>
            <button className="btn btn-gold" onClick={handleBuyNow} style={{ flex: 1 }}>Купить сейчас</button>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {['🚚 Доставка от 1 дня', '↩ Возврат 30 дней', '🔒 Безопасная оплата'].map(t => (
              <span key={t} style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container" style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid var(--gray-100)', marginBottom: '2rem' }}>
          {[['desc', 'Описание'], ['delivery', 'Доставка'], ['reviews', `Отзывы (${product.reviews})`]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: '0.75rem 1.5rem', border: 'none', background: 'transparent',
              fontFamily: 'DM Sans, sans-serif', fontWeight: tab === key ? 700 : 400,
              borderBottom: `2px solid ${tab === key ? 'var(--black)' : 'transparent'}`,
              marginBottom: '-2px', cursor: 'pointer', fontSize: '0.875rem', color: tab === key ? 'var(--black)' : 'var(--gray-400)', transition: 'all 0.2s'
            }}>{label}</button>
          ))}
        </div>
        {tab === 'desc' && (
          <div style={{ maxWidth: 680 }}>
            <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: '1rem' }}>{product.description}</p>
            <p style={{ color: 'var(--gray-600)', lineHeight: 1.8 }}>
              Изготовлен из высококачественных материалов с соблюдением всех стандартов бренда {product.brand}. Гарантия подлинности и качества.
            </p>
          </div>
        )}
        {tab === 'delivery' && (
          <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[['Стандартная доставка', '3-5 рабочих дней', 'Бесплатно от 5 000 ₽'], ['Экспресс-доставка', '1-2 рабочих дня', '490 ₽'], ['Самовывоз', 'Готово за 2 часа', 'Бесплатно']].map(([title, time, price]) => (
              <div key={title} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'var(--gray-50)', borderRadius: 10, border: '1px solid var(--gray-100)' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>{time}</div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{price}</div>
              </div>
            ))}
          </div>
        )}
        {tab === 'reviews' && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', padding: '1.5rem', background: 'var(--gray-50)', borderRadius: 12, border: '1px solid var(--gray-100)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'Playfair Display, serif' }}>{product.rating}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginBottom: '0.25rem' }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: 'var(--accent)' }}>★</span>)}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>{product.reviews} отзывов</div>
              </div>
              <div style={{ flex: 1 }}>
                {[5,4,3,2,1].map(star => {
                  const pct = star === 5 ? 65 : star === 4 ? 20 : star === 3 ? 10 : star === 2 ? 3 : 2;
                  return (
                    <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.75rem', width: 8 }}>{star}</span>
                      <span style={{ color: 'var(--accent)', fontSize: '0.75rem' }}>★</span>
                      <div style={{ flex: 1, height: 6, background: 'var(--gray-200)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--gray-400)', width: 28 }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)', textAlign: 'center', padding: '2rem' }}>
              Войдите, чтобы оставить отзыв
            </div>
          </div>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="container" style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Похожие товары</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
      <style>{`@media(max-width:768px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}
