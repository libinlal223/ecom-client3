
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import Contact from './pages/Contact';
import SearchPage from './pages/SearchPage';

// Admin Imports
import AdminLayout from './admin/AdminLayout';
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import ProductsList from './admin/pages/ProductsList';
import CategoryManager from './admin/pages/CategoryManager';
import ProductEditor from './admin/pages/ProductEditor';

import 'lucide-react';

// Wrapper for Public Pages
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="main-content">
      {children}
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <div className="app-layout">
      <Routes>
        {/* Admin Routes (No Public Navbar/Footer) */}
        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="products/new" element={<ProductEditor />} />
          <Route path="products/:id" element={<ProductEditor />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="*" element={<div style={{ padding: '2rem' }}>404 - Admin Section Not Found</div>} />
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/category/:categoryId" element={<PublicLayout><CategoryPage /></PublicLayout>} />
        <Route path="/category/:categoryId/:subcategoryId" element={<PublicLayout><CategoryPage /></PublicLayout>} />
        <Route path="/product/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
        <Route path="/search" element={<PublicLayout><SearchPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        {/* 404 */}
        <Route path="*" element={<PublicLayout><div className="container" style={{ padding: '8rem', textAlign: 'center' }}><h2>Page not found</h2></div></PublicLayout>} />
      </Routes>
    </div>
  );
}

export default App;
