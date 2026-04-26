import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import { WishlistPage, OrdersPage, NotFoundPage } from './pages/OtherPages';
import AdminPage from './pages/AdminPage';
import { CreateProductPage, EditProductPage } from './pages/ProductFormPage';

function Layout({ children, noFooter }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!noFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <ToastProvider>
              <Routes>
                {/* Public */}
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
                <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
                <Route path="/cart" element={<Layout><CartPage /></Layout>} />
                <Route path="/wishlist" element={<Layout><WishlistPage /></Layout>} />

                {/* Auth */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected */}
                <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Layout><OrdersPage /></Layout></ProtectedRoute>} />

                {/* Admin */}
                <Route path="/admin" element={<AdminRoute><Layout><AdminPage /></Layout></AdminRoute>} />
                <Route path="/products/create" element={<AdminRoute><Layout><CreateProductPage /></Layout></AdminRoute>} />
                <Route path="/products/:id/edit" element={<AdminRoute><Layout><EditProductPage /></Layout></AdminRoute>} />

                {/* 404 */}
                <Route path="*" element={<Layout noFooter><NotFoundPage /></Layout>} />
              </Routes>
            </ToastProvider>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
