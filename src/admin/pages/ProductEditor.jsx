
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/mockDb';
import { productService } from '../../services/productService';
import { ArrowLeft, Upload, Plus, X, Minus } from 'lucide-react';

const ProductEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});

    // We will track raw File objects here before uploading to Cloudinary
    const [stagedFiles, setStagedFiles] = useState([]);
    // We will generate local preview URLs here so the user can see what they selected
    const [previewUrls, setPreviewUrls] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        subcategory: '',
        price: '',
        description: '',
        features: [''],
        // This will hold existing Cloudinary URLs (from edit mode) 
        // OR newly generated Cloudinary URLs (after clicking Create Product)
        images: [],
        stock: 0,
        sku: ''
    });

    useEffect(() => {
        loadInitialData();
    }, [id]);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [cats, subs] = await Promise.all([
                db.getCategories(),
                db.getSubcategories()
            ]);
            setCategories(cats);
            setSubcategories(subs);

            if (isEditing) {
                const product = await db.getProduct(id);
                if (product) {
                    setFormData({
                        ...product,
                        features: product.features.length ? product.features : ['']
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load product data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
    };

    const removeFeature = (index) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Store the raw File objects for later uploading
        setStagedFiles(prev => [...prev, ...files]);

        // Create fast local browser previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviews]);

        // Clear the file input so the same file could be selected again if needed
        e.target.value = '';
    };

    const removeStagedFile = (index) => {
        setStagedFiles(prev => prev.filter((_, i) => i !== index));
        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(previewUrls[index]);
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Step 1: Upload any newly staged files to Cloudinary FIRST
            let newUploadedUrls = [];
            if (stagedFiles.length > 0) {
                newUploadedUrls = await Promise.all(
                    stagedFiles.map(file => {
                        return db.uploadImage(file, (progress) => {
                            setUploadProgress(prev => ({
                                ...prev,
                                [file.name]: progress
                            }));
                        });
                    })
                );
            }

            // Clean up object URLs to prevent memory leaks
            previewUrls.forEach(url => URL.revokeObjectURL(url));

            // Merge old images with new Cloudinary URLs
            const finalFormData = {
                ...formData,
                images: [...formData.images, ...newUploadedUrls]
            };

            // Step 2: Save metadata to Supabase
            if (isEditing) {
                await db.updateProduct(id, finalFormData);
            } else {
                await db.createProduct(finalFormData);
            }

            productService.clearCache();

            // Sync local state to be strictly Cloudinary URLs just in case UI needs it before navigation
            setFormData(finalFormData);

            navigate('/admin/products');
        } catch (error) {
            console.error('Failed to save product', error);
            alert(`Error saving product: ${error.message}`);
        } finally {
            setLoading(false);
            setUploadProgress({});
            // Reset blob previews & files safely regardless of success/fail
            setPreviewUrls([]);
            setStagedFiles([]);
        }
    };


    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    };

    if (loading) return <div className="p-8 text-center">Loading editor...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button
                    onClick={() => navigate('/admin/products')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', '&:hover': { background: '#eee' } }}
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: '1.875rem', fontWeight: '700', margin: 0 }}>
                    {isEditing ? 'Edit Product' : 'Create New Product'}
                </h1>
            </div>

            <form
                onSubmit={handleSubmit}
                onKeyDown={handleKeyDown}
                style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}
            >

                {/* Main Content Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Basic Info Card */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>Basic Information</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                                placeholder="e.g., 20V Cordless Drill Driver"
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="6"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontFamily: 'inherit' }}
                                placeholder="Detailed product description..."
                            />
                        </div>
                    </div>

                    {/* Features Card */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Key Features</h3>
                            <button
                                type="button"
                                onClick={addFeature}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                <Plus size={16} /> Add Feature
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {formData.features.map((feature, index) => (
                                <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                        placeholder={`Feature ${index + 1}`}
                                        style={{ flex: 1, padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(index)}
                                        style={{ padding: '0.5rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image Upload Card */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Images</h3>

                        <div style={{ border: '2px dashed #d1d5db', borderRadius: '0.5rem', padding: '2rem', textAlign: 'center', cursor: 'pointer', marginBottom: '1.5rem' }}>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <Upload size={32} color="#9ca3af" />
                                <span style={{ color: '#4b5563' }}>Click to upload images</span>
                            </label>
                        </div>

                        {/* Progress Bars for Uploading Images during submit */}
                        {Object.keys(uploadProgress).length > 0 && (
                            <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563' }}>Uploading to media server...</h4>
                                {Object.entries(uploadProgress).map(([fileName, progress]) => (
                                    <div key={fileName} style={{ background: '#f9fafb', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${progress}%`, height: '100%', background: '#3b82f6', transition: 'width 0.2s ease' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
                            {/* Render already uploaded images (from edit mode) */}
                            {formData.images.map((url, index) => (
                                <div key={`existing-${index}`} style={{ position: 'relative', aspectRatio: '1', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                                    <img src={url} alt="Existing product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            background: '#ef4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            padding: 0,
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        <Minus size={14} strokeWidth={3} />
                                    </button>
                                </div>
                            ))}

                            {/* Render local preview images (staged for upload) */}
                            {previewUrls.map((url, index) => (
                                <div key={`preview-${index}`} style={{ position: 'relative', aspectRatio: '1', borderRadius: '0.5rem', overflow: 'hidden', border: '2px solid #3b82f6' }}>
                                    <img src={url} alt="Staged preview" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                                    <button
                                        type="button"
                                        onClick={() => removeStagedFile(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            background: '#ef4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            padding: 0,
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        <Minus size={14} strokeWidth={3} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Organization Card */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>Organization</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Sub-Category</label>
                            <select
                                name="subcategory"
                                value={formData.subcategory || ''}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                            >
                                <option value="">Select Sub-Category</option>
                                {subcategories
                                    .filter(s => s.category_id === formData.category)
                                    .map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>Pricing</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                            />
                        </div>


                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ padding: '1rem', fontSize: '1.125rem', fontWeight: '600', marginTop: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
                    </button>

                </div>
            </form>
        </div>
    );
};

export default ProductEditor;
