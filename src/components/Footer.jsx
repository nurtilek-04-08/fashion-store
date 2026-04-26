import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--black)', color: 'var(--white)', marginTop: '5rem' }}>
      <div className="container" style={{ padding: '4rem 2rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem' }}>
              LUXE<span style={{ color: 'var(--accent)' }}>.</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#999', lineHeight: 1.7, maxWidth: 220 }}>
              Премиальная мода для тех, кто ценит стиль, качество и индивидуальность.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              {['Instagram', 'TikTok', 'VK'].map(s => (
                <span key={s} style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#777', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.target.style.color = '#777'}>{s}</span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.25rem' }}>Каталог</div>
            {[['Кроссовки', '/products?cat=Кроссовки'], ['Худи', '/products?cat=Худи'], ['Футболки', '/products?cat=Футболки'], ['Джинсы', '/products?cat=Джинсы'], ['Куртки', '/products?cat=Куртки'], ['Носки', '/products?cat=Носки']].map(([label, to]) => (
              <div key={label} style={{ marginBottom: '0.6rem' }}>
                <Link to={to} style={{ fontSize: '0.85rem', color: '#999', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--white)'}
                  onMouseLeave={e => e.target.style.color = '#999'}>{label}</Link>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.25rem' }}>Бренды</div>
            {['Nike', 'Adidas', 'Balenciaga', 'Louis Vuitton', 'Polo Ralph Lauren', 'Tommy Hilfiger'].map(b => (
              <div key={b} style={{ marginBottom: '0.6rem' }}>
                <Link to={`/products?brand=${b}`} style={{ fontSize: '0.85rem', color: '#999', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--white)'}
                  onMouseLeave={e => e.target.style.color = '#999'}>{b}</Link>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.25rem' }}>Информация</div>
            {['О нас', 'Доставка', 'Возврат', 'Размерная сетка', 'Контакты'].map(item => (
              <div key={item} style={{ marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#999', cursor: 'pointer' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #222', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#555' }}>© 2025 LUXE. Все права защищены.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Visa', 'MasterCard', 'МИР', 'СБП'].map(p => (
              <span key={p} style={{ fontSize: '0.72rem', color: '#555', letterSpacing: '0.05em' }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
