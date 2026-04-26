import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BRANDS, CATEGORIES } from '../data/products';

const TABS = ['Обзор', 'Товары', 'Пользователи'];

export default function AdminPage() {
  const { products, deleteProduct } = useProducts();
  const { getAllUsers, deleteUser, user: currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Обзор');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const users = getAllUsers();

  const catData = CATEGORIES.map(c => ({ name: c, count: products.filter(p => p.category === c).length }));
  const brandData = BRANDS.slice(0, 8).map(b => ({ name: b.slice(0, 8), count: products.filter(p => p.brand === b).length }));

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteProduct = (id) => {
    deleteProduct(id);
    setConfirmDelete(null);
    toast('Товар удалён', 'warning');
  };

  const handleDeleteUser = (id) => {
    if (id === currentUser.id) { toast('Нельзя удалить свой аккаунт', 'error'); return; }
    deleteUser(id);
    toast('Пользователь удалён', 'warning');
  };

  return (
    <div className="page-pad container" style={{ padding: '5rem 2rem 4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Панель управления</span>
          <h1>Администратор</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/products/create" className="btn btn-gold" style={{ fontSize: '0.8rem' }}>+ Добавить товар</Link>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--gray-100)', marginBottom: '2rem', gap: 0 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '0.75rem 1.5rem', border: 'none', background: 'transparent',
            fontFamily: 'DM Sans, sans-serif', fontWeight: tab === t ? 700 : 400,
            borderBottom: `2px solid ${tab === t ? 'var(--black)' : 'transparent'}`, marginBottom: '-2px',
            cursor: 'pointer', fontSize: '0.875rem', color: tab === t ? 'var(--black)' : 'var(--gray-400)'
          }}>{t}</button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'Обзор' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Товаров', value: products.length, icon: '📦', color: 'var(--accent)' },
              { label: 'Пользователей', value: users.length, icon: '👥', color: '#8b5cf6' },
              { label: 'Скидочных', value: products.filter(p => p.isSale).length, icon: '🏷', color: 'var(--red)' },
              { label: 'Новинок', value: products.filter(p => p.isNew).length, icon: '✨', color: 'var(--green)' },
            ].map(({ label, value, icon, color }) => (
              <div key={label} style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 12, padding: '1.5rem' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{icon}</div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gray-400)', marginBottom: '0.3rem' }}>{label}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Playfair Display, serif', color }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 12, padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>По категориям</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={catData} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={70} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#c9a96e" radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 12, padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>По брендам (топ-8)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={brandData}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0a0a0a" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS */}
      {tab === 'Товары' && (
        <div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
            <input className="input-field" placeholder="Поиск товара..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
            <Link to="/products/create" className="btn btn-primary" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>+ Добавить</Link>
          </div>
          <div style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-100)' }}>
                  {['Товар', 'Бренд', 'Категория', 'Цена', 'Статус', 'Действия'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray-400)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--gray-100)', background: i % 2 === 0 ? 'var(--white)' : 'var(--gray-50)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={p.image} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, background: 'var(--gray-100)' }} />
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>{p.brand}</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>{p.category}</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.875rem', fontWeight: 700 }}>{p.price.toLocaleString('ru-RU')} ₽</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {p.isNew && <span className="badge badge-new" style={{ fontSize: '0.6rem' }}>New</span>}
                        {p.isSale && <span className="badge badge-sale" style={{ fontSize: '0.6rem' }}>Sale</span>}
                        {!p.isNew && !p.isSale && <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>—</span>}
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/products/${p.id}`} style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textDecoration: 'underline' }}>Просмотр</Link>
                        <Link to={`/products/${p.id}/edit`} style={{ fontSize: '0.75rem', color: 'var(--accent)', textDecoration: 'underline' }}>Изменить</Link>
                        <button onClick={() => setConfirmDelete({ type: 'product', id: p.id, name: p.name })} style={{ fontSize: '0.75rem', color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Удалить</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>Ничего не найдено</div>}
          </div>
        </div>
      )}

      {/* USERS */}
      {tab === 'Пользователи' && (
        <div style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-100)' }}>
                {['Пользователь', 'Email', 'Телефон', 'Роль', 'Дата', 'Действия'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray-400)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--gray-100)', background: i % 2 === 0 ? 'var(--white)' : 'var(--gray-50)' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'var(--black)' }}>
                        {u.name?.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--gray-600)' }}>{u.email}</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--gray-600)' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ fontSize: '0.7rem', background: u.role === 'admin' ? 'var(--accent)' : 'var(--gray-100)', color: u.role === 'admin' ? 'var(--black)' : 'var(--gray-600)', padding: '0.2rem 0.6rem', borderRadius: 100, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: 'var(--gray-400)' }}>{u.createdAt}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {u.id !== currentUser.id && (
                      <button onClick={() => handleDeleteUser(u.id)} style={{ fontSize: '0.75rem', color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Удалить</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000 }} onClick={() => setConfirmDelete(null)}>
          <div style={{ background: 'var(--white)', borderRadius: 16, padding: '2rem', maxWidth: 400, width: '90%', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗑</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Удалить товар?</h3>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>«{confirmDelete.name}» будет удалён безвозвратно</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Отмена</button>
              <button className="btn btn-primary" style={{ background: 'var(--red)' }} onClick={() => handleDeleteProduct(confirmDelete.id)}>Удалить</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@media(max-width:768px){div[style*="1fr 1fr"]{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}
