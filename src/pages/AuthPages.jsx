import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function AuthLayout({ title, subtitle, children, altLink, altText, altLabel }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 700, color: 'var(--black)' }}>
            LUXE<span style={{ color: 'var(--accent)' }}>.</span>
          </Link>
          <h2 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>{title}</h2>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>{subtitle}</p>
        </div>
        <div style={{ background: 'var(--white)', borderRadius: 16, padding: '2.5rem', border: '1px solid var(--gray-100)', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
          {children}
        </div>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
          {altLabel} <Link to={altLink} style={{ color: 'var(--accent)', fontWeight: 600 }}>{altText}</Link>
        </p>
      </div>
    </div>
  );
}

export function LoginPage() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handle = async (ev) => {
    ev.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const e = {};
    if (!email) e.email = 'Введите email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Некорректный email';
    if (!password) e.password = 'Введите пароль';
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const res = login(email, password);
    setLoading(false);
    if (!res.ok) { setErrors({ general: res.error }); return; }
    toast('Добро пожаловать!');
    navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
  };

  return (
    <AuthLayout title="Вход в аккаунт" subtitle="Введите данные для входа" altLink="/register" altText="Зарегистрироваться" altLabel="Нет аккаунта?">
      {errors.general && (
        <div style={{ background: '#fff5f5', border: '1px solid #ffd0d0', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--red)' }}>
          {errors.general}
        </div>
      )}
      <form onSubmit={handle} noValidate>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>Email</label>
          <input ref={emailRef} type="email" placeholder="your@email.com" className={`input-field ${errors.email ? 'error' : ''}`} onChange={() => setErrors(p => ({ ...p, email: '' }))} />
          {errors.email && <p style={{ fontSize: '0.78rem', color: 'var(--red)', marginTop: '0.3rem' }}>{errors.email}</p>}
        </div>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>Пароль</label>
          <input ref={passwordRef} type="password" placeholder="Ваш пароль" className={`input-field ${errors.password ? 'error' : ''}`} onChange={() => setErrors(p => ({ ...p, password: '' }))} />
          {errors.password && <p style={{ fontSize: '0.78rem', color: 'var(--red)', marginTop: '0.3rem' }}>{errors.password}</p>}
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Входим...' : 'Войти'}
        </button>
      </form>
      <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--gray-600)' }}>
        <strong>Тест:</strong> admin@luxe.com / admin123 · user@luxe.com / user123
      </div>
    </AuthLayout>
  );
}

export function RegisterPage() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handle = async (ev) => {
    ev.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirm = confirmRef.current.value;
    const e = {};
    if (!name.trim()) e.name = 'Введите имя';
    if (!email) e.email = 'Введите email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Некорректный email';
    if (!password) e.password = 'Введите пароль';
    else if (password.length < 6) e.password = 'Минимум 6 символов';
    if (!confirm) e.confirm = 'Подтвердите пароль';
    else if (password !== confirm) e.confirm = 'Пароли не совпадают';
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const res = register(name, email, password);
    setLoading(false);
    if (!res.ok) { setErrors({ general: res.error }); return; }
    toast('Аккаунт создан!');
    navigate('/dashboard');
  };

  return (
    <AuthLayout title="Создать аккаунт" subtitle="Присоединяйтесь к LUXE" altLink="/login" altText="Войти" altLabel="Уже есть аккаунт?">
      {errors.general && (
        <div style={{ background: '#fff5f5', border: '1px solid #ffd0d0', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--red)' }}>
          {errors.general}
        </div>
      )}
      <form onSubmit={handle} noValidate>
        {[
          { ref: nameRef, key: 'name', label: 'Имя', type: 'text', ph: 'Алексей Смирнов' },
          { ref: emailRef, key: 'email', label: 'Email', type: 'email', ph: 'your@email.com' },
          { ref: passwordRef, key: 'password', label: 'Пароль', type: 'password', ph: 'Минимум 6 символов' },
          { ref: confirmRef, key: 'confirm', label: 'Подтвердите пароль', type: 'password', ph: 'Повторите пароль' },
        ].map(({ ref, key, label, type, ph }) => (
          <div key={key} style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>{label}</label>
            <input ref={ref} type={type} placeholder={ph} className={`input-field ${errors[key] ? 'error' : ''}`} onChange={() => setErrors(p => ({ ...p, [key]: '' }))} />
            {errors[key] && <p style={{ fontSize: '0.78rem', color: 'var(--red)', marginTop: '0.3rem' }}>{errors[key]}</p>}
          </div>
        ))}
        <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
        </button>
      </form>
    </AuthLayout>
  );
}