import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' });
  const [errors, setErrors] = useState({});
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});

  const upd = k => v => setForm(p => ({ ...p, [k]: v }));
  const updPw = k => v => setPwForm(p => ({ ...p, [k]: v }));

  const handleSave = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Введите имя';
    if (!form.email) errs.email = 'Введите email';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    updateProfile({ name: form.name, phone: form.phone });
    setEditing(false);
    toast('Профиль обновлён!');
  };

  const handlePw = (e) => {
    e.preventDefault();
    const errs = {};
    if (!pwForm.current) errs.current = 'Введите текущий пароль';
    if (!pwForm.next || pwForm.next.length < 6) errs.next = 'Минимум 6 символов';
    if (pwForm.next !== pwForm.confirm) errs.confirm = 'Пароли не совпадают';
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    setPwForm({ current: '', next: '', confirm: '' });
    toast('Пароль изменён!');
  };

  const avatar = user?.name?.charAt(0).toUpperCase();

  return (
    <div className="page-pad container" style={{ padding: '5rem 2rem 4rem', maxWidth: 800 }}>
      <h1 style={{ marginBottom: '2rem' }}>Профиль</h1>

      {/* Avatar & name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', padding: '1.75rem', background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 16 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700, color: 'var(--black)', fontFamily: 'Playfair Display, serif' }}>
          {avatar}
        </div>
        <div>
          <h2 style={{ marginBottom: '0.25rem', fontSize: '1.3rem' }}>{user?.name}</h2>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>{user?.email}</p>
          <span style={{ fontSize: '0.7rem', background: user?.role === 'admin' ? 'var(--accent)' : 'var(--gray-100)', color: user?.role === 'admin' ? 'var(--black)' : 'var(--gray-600)', padding: '0.2rem 0.6rem', borderRadius: 100, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.5rem', display: 'inline-block' }}>
            {user?.role === 'admin' ? 'Администратор' : 'Покупатель'}
          </span>
        </div>
        <button className="btn btn-ghost" onClick={() => setEditing(!editing)} style={{ marginLeft: 'auto', fontSize: '0.8rem' }}>
          {editing ? 'Отмена' : '✏ Редактировать'}
        </button>
      </div>

      {/* Profile form */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 16, padding: '1.75rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Личные данные</h3>
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {[{ k: 'name', label: 'Имя', ph: 'Алексей Смирнов' }, { k: 'phone', label: 'Телефон', ph: '+7 (999) 000-00-00' }].map(({ k, label, ph }) => (
              <div key={k}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>{label}</label>
                <input value={form[k]} onChange={e => upd(k)(e.target.value)} placeholder={ph} disabled={!editing}
                  className={`input-field ${errors[k] ? 'error' : ''}`}
                  style={{ background: editing ? 'var(--white)' : 'var(--gray-50)', cursor: editing ? 'text' : 'default' }} />
                {errors[k] && <p style={{ fontSize: '0.78rem', color: 'var(--red)', marginTop: '0.3rem' }}>{errors[k]}</p>}
              </div>
            ))}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>Email</label>
            <input value={form.email} disabled className="input-field" style={{ background: 'var(--gray-50)', cursor: 'default' }} />
          </div>
          {editing && <button className="btn btn-primary" type="submit" style={{ fontSize: '0.85rem' }}>Сохранить изменения</button>}
        </form>
      </div>

      {/* Password */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 16, padding: '1.75rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Изменить пароль</h3>
        <form onSubmit={handlePw}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400 }}>
            {[{ k: 'current', label: 'Текущий пароль' }, { k: 'next', label: 'Новый пароль' }, { k: 'confirm', label: 'Подтвердите новый' }].map(({ k, label }) => (
              <div key={k}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>{label}</label>
                <input type="password" value={pwForm[k]} onChange={e => updPw(k)(e.target.value)} className={`input-field ${pwErrors[k] ? 'error' : ''}`} />
                {pwErrors[k] && <p style={{ fontSize: '0.78rem', color: 'var(--red)', marginTop: '0.3rem' }}>{pwErrors[k]}</p>}
              </div>
            ))}
            <button className="btn btn-outline" type="submit" style={{ fontSize: '0.85rem', alignSelf: 'flex-start' }}>Изменить пароль</button>
          </div>
        </form>
      </div>
      <style>{`@media(max-width:600px){div[style*="1fr 1fr"]{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}
