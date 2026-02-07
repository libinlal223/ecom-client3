
import React, { useEffect, useState } from 'react';
import { db } from '../services/mockDb';
import { TrendingUp, Package } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        categoryCounts: []
    });

    useEffect(() => {
        const loadStats = async () => {
            const [productRes, categories] = await Promise.all([
                db.getProducts(1, 1000), // Fetch enough products to count
                db.getCategories()
            ]);

            // Calculate product counts per category
            const counts = categories.map(cat => {
                const count = productRes.data.filter(p => p.category === cat.id).length;
                return {
                    id: cat.id,
                    name: cat.name,
                    count: count,
                    color: getRandomColor(cat.id) // Helper for consistent colors
                };
            });

            setStats({
                totalProducts: productRes.total,
                totalCategories: categories.length,
                categoryCounts: counts
            });
        };
        loadStats();
    }, []);

    // Helper to generate consistent colors based on ID
    const getRandomColor = (id) => {
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: '800', color: '#111827' }}>Dashboard Overview</h1>

            {/* Top Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', borderRadius: '0.5rem', background: '#3b82f615', color: '#3b82f6' }}>
                        <Package size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Products</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>{stats.totalProducts}</div>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', borderRadius: '0.5rem', background: '#10b98115', color: '#10b981' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Categories</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>{stats.totalCategories}</div>
                    </div>
                </div>
            </div>

            {/* Category Breakdown Grid */}
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '600', color: '#374151' }}>Products by Category</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {stats.categoryCounts.map((cat) => (
                    <div key={cat.id} style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '0.75rem',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        transition: 'transform 0.2s',
                        cursor: 'default',
                        ':hover': { transform: 'translateY(-2px)' }
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                background: `${cat.color}15`,
                                color: cat.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}>
                                {cat.name.charAt(0)}
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#9ca3af', background: '#f3f4f6', padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>
                                {cat.count} items
                            </span>
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>{cat.name}</h3>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>ID: {cat.id}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
