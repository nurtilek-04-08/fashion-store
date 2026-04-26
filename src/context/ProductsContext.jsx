import React, { createContext, useContext, useState } from 'react';
import { products as initialProducts } from '../data/products';

const ProductsContext = createContext(null);

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('luxe_products');
      return stored ? JSON.parse(stored) : initialProducts;
    } catch { return initialProducts; }
  });

  const save = (updated) => {
    setProducts(updated);
    localStorage.setItem('luxe_products', JSON.stringify(updated));
  };

  const createProduct = (data) => {
    const newProduct = { ...data, id: Date.now(), rating: 4.5, reviews: 0, inStock: true };
    save([...products, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, data) => {
    const updated = products.map(p => p.id === parseInt(id) ? { ...p, ...data } : p);
    save(updated);
  };

  const deleteProduct = (id) => {
    save(products.filter(p => p.id !== parseInt(id)));
  };

  const getById = (id) => products.find(p => p.id === parseInt(id));
  const getRelated = (product) => products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <ProductsContext.Provider value={{ products, createProduct, updateProduct, deleteProduct, getById, getRelated }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
