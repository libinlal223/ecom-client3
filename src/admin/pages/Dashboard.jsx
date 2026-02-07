
import React, { useEffect, useState } from 'react';
import { db } from '../services/mockDb';
import { TrendingUp, Package, AlertTriangle, Users } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalProducts: 0, categories: 0, lowStock: 0, revenue: 0 });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        const [products, categories] = await Promise.all([
            db.getProducts(1, 1000),
            db.getCategories()
        ]);

        setStats({
            totalProducts: products.total,
            categories: categories.length,
            lowStock: products.data.filter(p => p.stock < 10).length,
            revenue: products.data.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0) // Mock revenue calc
        });
    };

    const cards = [
        { label: 'Total Products', value: stats.totalProducts, icon: Package, color: '#2563eb' },
        { label: 'Categories', value: stats.categories, icon: TrendingUp, color: '#10b981' },
        { label: 'Low Stock Alerts', value: stats.lowStock, icon: AlertTriangle, color: '#f59e0b' },
        { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: Users, color: '#6366f1' },
    ];

    return (
        <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Dashboard Overview</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {cards.map((card, i) => (
                    <div key={i} style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            background: `${card.color}15`,
                            color: card.color
                        }}>
                            <card.icon size={24} />
                        </div>
                        <div>
                            <div className="text-muted" style={{ fontSize: '0.875rem' }}>{card.label}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{card.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '3rem', background: 'white', padding: '2rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)' }}>
                <h3>Recent Activity</h3>
                <p className="text-muted">System initialized. Waiting for real-time updates.</p>
            </div>
        </div>
    );
};

export default Dashboard;
