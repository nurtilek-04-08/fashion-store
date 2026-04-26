import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/ProductCard';
import { BRANDS, CATEGORIES } from '../data/products';

export default function HomePage() {
  const { products } = useProducts();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const featured = products.filter(p => p.isNew).slice(0, 4);
  const sale = products.filter(p => p.isSale).slice(0, 4);
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      {/* Hero */}
      <section style={{
        minHeight: '92vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)'
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&h=900&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.25 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 650 }}>
            <div style={{ display: 'inline-block', background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.3)', borderRadius: 100, padding: '0.4rem 1.2rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 600 }}>Коллекция 2025</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--white)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Стиль без<br /><span style={{ color: 'var(--accent)' }}>компромиссов</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#aaa', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: 480 }}>
              Эксклюзивные коллекции Nike, Adidas, Balenciaga, Louis Vuitton и других топовых брендов. Премиальное качество — реальные цены.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn btn-gold" style={{ fontSize: '0.8rem' }}>Смотреть каталог</Link>
              <Link to="/products?isSale=true" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--white)', border: '1.5px solid rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>Распродажа</Link>
            </div>
          </div>
        </div>
        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#555' }}>
          <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Листать вниз</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, #555, transparent)', animation: 'pulse 2s infinite' }} />
        </div>
      </section>

      {/* Brands strip */}
      <section style={{ padding: '2rem 0', background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-100)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '3rem', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} onClick={() => navigate(`/products?brand=${b}`)} style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gray-400)', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--black)'}
              onMouseLeave={e => e.target.style.color = 'var(--gray-400)'}>{b}</span>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } } @keyframes pulse { 0%,100% { opacity:0.3; } 50% { opacity:1; } }`}</style>
      </section>

      {/* Categories */}
      <section className="container" style={{ padding: '5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>Категории</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
          {CATEGORIES.map((cat) => (
            <Link key={cat} to={`/products?cat=${cat}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--gray-50)', border: '1px solid var(--gray-100)', borderRadius: 12,
                padding: '1.5rem 1rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--black)'; e.currentTarget.style.color = 'var(--white)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--gray-50)'; e.currentTarget.style.color = 'var(--black)'; }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                  {cat === 'Кроссовки' ? '👟' : cat === 'Футболки' ? '👕' : cat === 'Худи' ? '🧥' : cat === 'Джинсы' ? '👖' : cat === 'Куртки' ? '🧣' : cat === 'Носки' ? '🧦' : cat === 'Брюки' ? '👔' : '👗'}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.05em' }}>{cat}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="container" style={{ padding: '0 2rem 5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>Новинки</h2>
          <Link to="/products?isNew=true" style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 600 }}>Все новинки →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Banner */}
      <section style={{ background: 'var(--black)', padding: '5rem 2rem', margin: '0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1556906781-9a412961a28c?w=1400&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700, display: 'block', marginBottom: '1rem' }}>Распродажа</span>
            <h2 style={{ color: 'var(--white)', fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', marginBottom: '1rem' }}>До −40%<br />на топовые бренды</h2>
            <p style={{ color: '#888', marginBottom: '2rem', lineHeight: 1.7 }}>Nike, Adidas, Puma, Tommy Hilfiger и другие бренды по специальным ценам. Успейте пока не разобрали.</p>
            <Link to="/products?isSale=true" className="btn btn-gold">Смотреть скидки</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {sale.slice(0, 4).map(p => (
              <Link key={p.id} to={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', opacity: 0.85 }} />
                  <div style={{ padding: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{p.brand}</div>
                    <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--red)' }}>{p.price.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){.container>div{grid-template-columns:1fr !important;}}`}</style>
      </section>

      {/* Top rated */}
      <section className="container" style={{ padding: '5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>Топ рейтинга</h2>
          <Link to="/products?sort=rating" style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 600 }}>Все товары →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {topRated.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Gender banners */}
      <section className="container" style={{ padding: '0 2rem 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {[{ gender: 'Мужской', label: 'Для него', img: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=700&h=500&fit=crop' }, { gender: 'Женский', label: 'Для неё', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&h=500&fit=crop' }].map(({ gender, label, img }) => (
            <Link key={gender} to={`/products?gender=${gender}`} style={{ textDecoration: 'none' }}>
              <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: 400, cursor: 'pointer' }}>
                <img src={img} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>Коллекция</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'var(--white)', fontWeight: 700 }}>{label}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ background: 'var(--gray-50)', padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '0.75rem' }}>Подпишитесь на новинки</h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: '2rem', fontSize: '0.9rem' }}>Получайте первыми информацию о новых коллекциях и эксклюзивных скидках</p>
        <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 460, margin: '0 auto', justifyContent: 'center' }}>
          <input value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="your@email.com" style={{ flex: 1 }} />
          <button className="btn btn-primary" onClick={() => { if (email) { alert('Спасибо! Вы подписались.'); setEmail(''); } }}>Подписаться</button>
        </div>
      </section>
    </div>
  );
}
