
import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDb';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', category_id: '' });

    // Simple state to toggle between 'categories' and 'subcategories' view
    const [viewMode, setViewMode] = useState('categories');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [cats, subs] = await Promise.all([
            db.getCategories(),
            db.getSubcategories(null) // Fetch all subcategories
        ]);
        setCategories(cats);
        setSubcategories(subs);
        setLoading(false);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (viewMode === 'categories') {
                await db.createCategory({ name: formData.name });
            } else {
                await db.createSubcategory({
                    name: formData.name,
                    category_id: formData.category_id
                });
            }
            await loadData();
            setFormData({ name: '', category_id: '' });
        } catch (error) {
            console.error('Failed to create', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Delete this category? Products in this category will be orphaned.')) return;
        setLoading(true);
        await db.deleteCategory(id);
        await loadData();
        setLoading(false);
    };

    const handleDeleteSubcategory = async (id) => {
        if (!window.confirm('Delete this subcategory?')) return;
        setLoading(true);
        await db.deleteSubcategory(id);
        await loadData();
        setLoading(false);
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading category data...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827' }}>Categories & Architecture</h1>
                    <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>Manage your product hierarchy here.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setViewMode('categories')}
                        className={`btn ${viewMode === 'categories' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Primary Categories
                    </button>
                    <button
                        onClick={() => setViewMode('subcategories')}
                        className={`btn ${viewMode === 'subcategories' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Sub-Categories
                    </button>
                </div>
            </div>

            {/* Creation Form */}
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                    Create New {viewMode === 'categories' ? 'Category' : 'Sub-Category'}
                </h3>
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    {viewMode === 'subcategories' && (
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Parent Category</label>
                            <select
                                style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #D1D5DB' }}
                                value={formData.category_id}
                                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    )}
                    <div style={{ flex: 2 }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Name</label>
                        <input
                            type="text"
                            style={{ width: '100%', padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #D1D5DB' }}
                            placeholder="e.g., Heavy Machinery"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.625rem 1.5rem' }}>
                        Create
                    </button>
                </form>
            </div>

            {/* Data Table */}
            <div style={{ background: '#fff', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                        <tr>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Name</th>
                            {viewMode === 'subcategories' && (
                                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Parent Category</th>
                            )}
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>ID / Slug</th>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Created At</th>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ divideY: '1px solid #E5E7EB' }}>
                        {(viewMode === 'categories' ? categories : subcategories).map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{item.name}</td>
                                {viewMode === 'subcategories' && (
                                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6B7280' }}>
                                        {categories.find(c => c.id === item.category_id)?.name || item.category_id}
                                    </td>
                                )}
                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6B7280', fontFamily: 'monospace' }}>{item.id}</td>
                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6B7280' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                    <button
                                        onClick={() => viewMode === 'categories' ? handleDeleteCategory(item.id) : handleDeleteSubcategory(item.id)}
                                        style={{ color: '#EF4444', fontWeight: '500', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoryManager;
