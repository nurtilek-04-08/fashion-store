import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const ADMIN_EMAIL = 'admin@luxe.com';
const ADMIN_PASS = 'admin123';

const USERS_KEY = 'luxe_users';
const SESSION_KEY = 'luxe_session';

const initUsers = () => {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    const defaultUsers = [
      { id: 1, email: ADMIN_EMAIL, password: ADMIN_PASS, name: 'Admin', role: 'admin', avatar: null, phone: '+7 (999) 000-00-00', createdAt: '2024-01-01' },
      { id: 2, email: 'user@luxe.com', password: 'user123', name: 'Алексей Смирнов', role: 'user', avatar: null, phone: '+7 (999) 123-45-67', createdAt: '2024-03-15' }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(stored);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initUsers();
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try { setUser(JSON.parse(session)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { ok: false, error: 'Неверный email или пароль' };
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    return { ok: true };
  };

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.find(u => u.email === email)) return { ok: false, error: 'Email уже зарегистрирован' };
    const newUser = { id: Date.now(), email, password, name, role: 'user', avatar: null, phone: '', createdAt: new Date().toISOString().split('T')[0] };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateProfile = (data) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const idx = users.findIndex(u => u.id === user.id);
    if (idx === -1) return;
    users[idx] = { ...users[idx], ...data };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const { password: _, ...safeUser } = users[idx];
    setUser(safeUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  };

  const getAllUsers = () => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.map(({ password: _, ...u }) => u);
  };

  const deleteUser = (id) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const updated = users.filter(u => u.id !== id);
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, getAllUsers, deleteUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
