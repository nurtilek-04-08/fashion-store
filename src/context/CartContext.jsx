import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('luxe_cart') || '[]'); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('luxe_wishlist') || '[]'); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem('luxe_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('luxe_wishlist', JSON.stringify(wishlist)); }, [wishlist]);

  const addToCart = (product, size, qty = 1) => {
    setCart(prev => {
      const key = `${product.id}-${size}`;
      const exists = prev.find(i => i.key === key);
      if (exists) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, size, qty, key }];
    });
  };

  const removeFromCart = (key) => setCart(prev => prev.filter(i => i.key !== key));
  const updateQty = (key, qty) => {
    if (qty < 1) return removeFromCart(key);
    setCart(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
  };
  const clearCart = () => setCart([]);

  const toggleWishlist = (product) => {
    setWishlist(prev =>
      prev.find(i => i.id === product.id)
        ? prev.filter(i => i.id !== product.id)
        : [...prev, product]
    );
  };

  const isInWishlist = (id) => wishlist.some(i => i.id === id);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, wishlist, addToCart, removeFromCart, updateQty, clearCart, toggleWishlist, isInWishlist, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
