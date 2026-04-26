import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { useToast } from '../context/ToastContext';
import { BRANDS, CATEGORIES, SIZES_CLOTHES, SIZES_SHOES } from '../data/products';

function ProductForm({ initial, onSubmit, title, submitLabel }) {
  const [form, setForm] = useState({
    name: '', brand: BRANDS[0], category: CATEGORIES[0], gender: 'Унисекс',
    price: '', oldPrice: '', image: '', description: '',
    isNew: false, isSale: false, inStock: true,
    sizes: [], colors: '', ...initial
  });
  const [errors, setErrors] = useState({});

  const upd = k => v => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const sizeOptions = form.category === 'Кроссовки' || form.category === 'Носки' ? SIZES_SHOES : SIZES_CLOTHES;

  const toggleSize = (size) => {
    setForm(p => ({ ...p, sizes: p.sizes.includes(size) ? p.sizes.filter(s => s !== size) : [...p.sizes, size] }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Введите название';
    if (!form.price || isNaN(form.price) || +form.price <= 0) e.price = 'Введите корректную цену';
    if (!form.image.trim()) e.image = 'Введите URL изображения';
    if (form.sizes.length === 0) e.sizes = 'Выберите хотя бы один размер';
    if (!form.description.trim()) e.description = 'Введите описание';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({
      ...form,
      price: +form.price,
      oldPrice: form.oldPrice ? +form.oldPrice : null,
      colors: typeof form.colors === 'string' ? form.colors.split(',').map(c => c.trim()).filter(Boolean) : form.colors
    });
  };

  const Field = ({ label, children, error }) => (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>{label}</label>
      {children}
      {error && <p style={{ fontSize: '0.78rem', color: 'var(--red)', marginTop: '0.3rem' }}>{error}</p>}
    </div>
  );

  return (
    <div className="page-pad container" style={{ padding: '5rem 2rem 4rem', maxWidth: 900 }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/admin" style={{ fontSize: '0.8rem', color: 'var(--gray-400)', textDecoration: 'none' }}>← Назад в admin</Link>
        <h1 style={{ marginTop: '0.5rem' }}>{title}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Left */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 16, padding: '1.75rem' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gray-600)' }}>Основная информация</h3>

            <Field label="Название товара" error={errors.name}>
              <input className={`input-field ${errors.name ? 'error' : ''}`} value={form.name} onChange={e => upd('name')(e.target.value)} placeholder="Air Max 270" />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Бренд">
                <select className="input-field" value={form.brand} onChange={e => upd('brand')(e.target.value)}>
                  {BRANDS.map(b => <option key={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Категория">
                <select className="input-field" value={form.category} onChange={e => upd('category')(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Пол">
              <select className="input-field" value={form.gender} onChange={e => upd('gender')(e.target.value)}>
                {['Мужской', 'Женский', 'Унисекс'].map(g => <option key={g}>{g}</option>)}
              </select>
            </Field>

            <Field label="Описание" error={errors.description}>
              <textarea className={`input-field ${errors.description ? 'error' : ''}`} value={form.description} onChange={e => upd('description')(e.target.value)}
                rows={4} placeholder="Описание товара..." style={{ resize: 'vertical' }} />
            </Field>

            <Field label="Цвета (через запятую)">
              <input className="input-field" value={typeof form.colors === 'string' ? form.colors : form.colors?.join(', ')} onChange={e => upd('colors')(e.target.value)} placeholder="Чёрный, Белый, Серый" />
            </Field>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 16, padding: '1.75rem' }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gray-600)' }}>Цена и изображение</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Цена (₽)" error={errors.price}>
                  <input className={`input-field ${errors.price ? 'error' : ''}`} type="number" value={form.price} onChange={e => upd('price')(e.target.value)} placeholder="9990" />
                </Field>
                <Field label="Старая цена (₽)">
                  <input className="input-field" type="number" value={form.oldPrice || ''} onChange={e => upd('oldPrice')(e.target.value)} placeholder="12990" />
                </Field>
              </div>

              <Field label="URL изображения" error={errors.image}>
                <input className={`input-field ${errors.image ? 'error' : ''}`} value={form.image} onChange={e => upd('image')(e.target.value)} placeholder="https://..." />
              </Field>
              {form.image && (
                <div style={{ marginTop: '0.75rem', borderRadius: 8, overflow: 'hidden', height: 140 }}>
                  <img src={form.image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                </div>
              )}
            </div>

            <div style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 16, padding: '1.75rem' }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gray-600)' }}>Размеры</h3>
              {errors.sizes && <p style={{ fontSize: '0.78rem', color: 'var(--red)', marginBottom: '0.5rem' }}>{errors.sizes}</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {sizeOptions.map(size => (
                  <button key={size} type="button" onClick={() => toggleSize(size)} style={{
                    padding: '0.4rem 0.7rem', borderRadius: 6, border: `1.5px solid ${form.sizes.includes(size) ? 'var(--black)' : 'var(--gray-200)'}`,
                    background: form.sizes.includes(size) ? 'var(--black)' : 'transparent',
                    color: form.sizes.includes(size) ? 'var(--white)' : 'var(--black)', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s'
                  }}>{size}</button>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 16, padding: '1.75rem' }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gray-600)' }}>Флаги</h3>
              {[['isNew', 'Новинка'], ['isSale', 'Скидка'], ['inStock', 'В наличии']].map(([key, label]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={form[key]} onChange={e => upd(key)(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--black)', cursor: 'pointer' }} />
                  {label}
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{submitLabel}</button>
              <Link to="/admin" className="btn btn-ghost" style={{ flex: 1, textAlign: 'center' }}>Отмена</Link>
            </div>
          </div>
        </div>
      </form>
      <style>{`@media(max-width:768px){div[style*="1fr 1fr"]{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}

export function CreateProductPage() {
  const { createProduct } = useProducts();
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <ProductForm
      title="Добавить товар"
      submitLabel="Создать товар"
      onSubmit={(data) => {
        createProduct(data);
        toast('Товар создан!');
        navigate('/admin');
      }}
    />
  );
}

export function EditProductPage() {
  const { id } = useParams();
  const { getById, updateProduct } = useProducts();
  const { toast } = useToast();
  const navigate = useNavigate();
  const product = getById(id);

  if (!product) return (
    <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
      <h2>Товар не найден</h2>
      <Link to="/admin" className="btn btn-primary" style={{ marginTop: '1rem' }}>В админ панель</Link>
    </div>
  );

  return (
    <ProductForm
      title={`Редактировать: ${product.name}`}
      submitLabel="Сохранить изменения"
      initial={{ ...product, colors: Array.isArray(product.colors) ? product.colors.join(', ') : product.colors }}
      onSubmit={(data) => {
        updateProduct(id, data);
        toast('Товар обновлён!');
        navigate('/admin');
      }}
    />
  );
}
