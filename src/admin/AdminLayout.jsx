
import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Layers, Settings, LogOut } from 'lucide-react';

const AdminLayout = () => {
    const token = localStorage.getItem('admin_token');
    const location = useLocation();

    if (!token) return <Navigate to="/admin/login" />;

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin';
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Package, label: 'Products', path: '/admin/products' },
        { icon: Layers, label: 'Categories', path: '/admin/categories' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: 'white',
                borderRight: '1px solid #e0e0e0',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ marginBottom: '2rem', fontWeight: '800', fontSize: '1.25rem', letterSpacing: '-0.03em', color: '#1a1a1a' }}>
                    Suntric Admin
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '0.5rem',
                                color: location.pathname === item.path ? '#ffffff' : '#757575',
                                background: location.pathname === item.path ? '#FFC107' : 'transparent',
                                fontWeight: '500',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        color: '#757575',
                        marginTop: 'auto',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontWeight: '500',
                        transition: 'color 0.2s ease'
                    }}
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
