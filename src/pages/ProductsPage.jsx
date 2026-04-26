import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/ProductCard';
import { BRANDS, CATEGORIES } from '../data/products';

export default function ProductsPage() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [category, setCategory] = useState(searchParams.get('cat') || '');
  const [gender, setGender] = useState(searchParams.get('gender') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'default');
  const [saleOnly, setSaleOnly] = useState(searchParams.get('isSale') === 'true');
  const [newOnly, setNewOnly] = useState(searchParams.get('isNew') === 'true');
  const [priceMax, setPriceMax] = useState(100000);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let res = [...products];
    if (search) res = res.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));
    if (brand) res = res.filter(p => p.brand === brand);
    if (category) res = res.filter(p => p.category === category);
    if (gender) res = res.filter(p => p.gender === gender || p.gender === 'Унисекс');
    if (saleOnly) res = res.filter(p => p.isSale);
    if (newOnly) res = res.filter(p => p.isNew);
    res = res.filter(p => p.price <= priceMax);

    if (sort === 'price_asc') res.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') res.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') res.sort((a, b) => b.rating - a.rating);
    else if (sort === 'new') res.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return res;
  }, [products, search, brand, category, gender, sort, saleOnly, newOnly, priceMax]);

  const clearFilters = () => { setBrand(''); setCategory(''); setGender(''); setSaleOnly(false); setNewOnly(false); setPriceMax(100000); setSearch(''); setSort('default'); };
  const hasFilters = brand || category || gender || saleOnly || newOnly || search || priceMax < 100000;

  const filterSection = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Brand */}
      <div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem', color: 'var(--gray-600)' }}>Бренд</div>
        <select className="input-field" value={brand} onChange={e => setBrand(e.target.value)} style={{ fontSize: '0.85rem' }}>
          <option value="">Все бренды</option>
          {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Category */}
      <div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem', color: 'var(--gray-600)' }}>Категория</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
            <input type="radio" name="cat" checked={category === ''} onChange={() => setCategory('')} /> Все
          </label>
          {CATEGORIES.map(c => (
            <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input type="radio" name="cat" checked={category === c} onChange={() => setCategory(c)} /> {c}
            </label>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem', color: 'var(--gray-600)' }}>Пол</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {[['', 'Все'], ['Мужской', 'Мужской'], ['Женский', 'Женский'], ['Унисекс', 'Унисекс']].map(([val, label]) => (
            <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input type="radio" name="gender" checked={gender === val} onChange={() => setGender(val)} /> {label}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem', color: 'var(--gray-600)' }}>
          Цена до {priceMax.toLocaleString('ru-RU')} ₽
        </div>
        <input type="range" min={1000} max={100000} step={1000} value={priceMax} onChange={e => setPriceMax(+e.target.value)} style={{ width: '100%', accentColor: 'var(--accent)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '0.25rem' }}>
          <span>1 000 ₽</span><span>100 000 ₽</span>
        </div>
      </div>

      {/* Checkboxes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input type="checkbox" checked={saleOnly} onChange={e => setSaleOnly(e.target.checked)} style={{ accentColor: 'var(--accent)' }} /> Только скидки
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input type="checkbox" checked={newOnly} onChange={e => setNewOnly(e.target.checked)} style={{ accentColor: 'var(--accent)' }} /> Только новинки
        </label>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="btn btn-ghost" style={{ fontSize: '0.78rem' }}>Сбросить фильтры</button>
      )}
    </div>
  );

  return (
    <div className="page-pad container" style={{ padding: '5rem 2rem 4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: '0.5rem' }}>Каталог</h1>
        <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>Найдено {filtered.length} товаров</p>
      </div>

      {/* Search + Sort bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <input className="input-field" placeholder="Поиск по названию или бренду..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', fontSize: '0.9rem' }}>🔍</span>
        </div>
        <select className="input-field" value={sort} onChange={e => setSort(e.target.value)} style={{ width: 'auto', fontSize: '0.85rem' }}>
          <option value="default">По умолчанию</option>
          <option value="price_asc">Цена: по возрастанию</option>
          <option value="price_desc">Цена: по убыванию</option>
          <option value="rating">По рейтингу</option>
          <option value="new">Сначала новинки</option>
        </select>
        <button className="btn btn-ghost" onClick={() => setShowFilters(!showFilters)} style={{ fontSize: '0.8rem', display: 'none' }} id="filter-toggle">
          Фильтры {hasFilters && '•'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2.5rem', alignItems: 'start' }}>
        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: 'calc(var(--nav-h) + 1rem)' }}>
          <div style={{ background: 'var(--gray-50)', borderRadius: 12, padding: '1.5rem', border: '1px solid var(--gray-100)' }}>
            {filterSection}
          </div>
        </aside>

        {/* Products grid */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Ничего не найдено</h3>
              <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>Попробуйте изменить фильтры</p>
              <button className="btn btn-primary" onClick={clearFilters}>Сбросить фильтры</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      <style>{`@media(max-width:900px){#filter-toggle{display:flex !important;} div[style*="260px"]{grid-template-columns:1fr !important;} aside{display:none;}}`}</style>
    </div>
  );
}
