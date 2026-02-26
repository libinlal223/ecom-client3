import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { Truck, ShieldCheck, ArrowLeft, Plus, Minus, Heart, Share2, ShoppingCart } from 'lucide-react';
import './ProductDetail.css';
import prd1 from '../assets/prd1.png';
import prd2 from '../assets/prd2.png';
import prd3 from '../assets/prd3.png';
import prd4 from '../assets/prd4.png';

export function getOptimizedImage(url, options = {}) {
    if (!url || typeof url !== 'string') return url;
    if (!url.includes('/upload/')) return url;
    const parts = url.split('/upload/');
    const width = options.width ? `w_${options.width},` : '';
    const transform = `${width}c_fill,f_auto,q_auto`;
    return `${parts[0]}/upload/${transform}/${parts[1]}`;
}

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setTimeout(() => {
                // Generate a rich dummy product for preview
                const dummyProduct = {
                    id: id,
                    name: "Professional High-Performance Tool",
                    description: "Built for ultimate performance and reliability. Featuring advanced ergonomic grips, this robust tool ensures precision engineering in every use case. Tested against industrial standard benchmarks for long-lasting endurance.",
                    price: "199.99",
                    category: "power-tools",
                    features: [
                        "Durable robust aluminum casing",
                        "High-torque motor for extreme precision",
                        "Anti-slip ergonomic handle",
                        "12-month standard warranty included"
                    ],
                    images: [
                        prd1,
                        prd2,
                        prd3,
                        prd4
                    ],
                    is_featured: true
                };

                setProduct(dummyProduct);
                setLoading(false);
            }, 600);
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return <div className="loading-page">Loading product details...</div>;
    }

    if (!product) {
        return (
            <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
                <h2>Product not found</h2>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            <div className="container">
                <nav className="breadcrumb-modern">
                    <button onClick={() => navigate(-1)} className="back-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div className="crumb-path">
                        <Link to="/">Home</Link> <span className="separator">/</span>
                        <Link to={`/category/${product.category}`}>{product.category.replace(/-/g, ' ')}</Link> <span className="separator">/</span>
                        <span className="current">{product.name}</span>
                    </div>
                </nav>

                <div className="product-view-modern">
                    {/* Image Gallery */}
                    <div className="product-gallery-modern">
                        <div className="main-image-wrapper">
                            {product.images && product.images[activeImage] && (
                                <img
                                    src={getOptimizedImage(product.images[activeImage], { width: 1000 })}
                                    alt={product.name}
                                    className="main-preview-img"
                                    loading="eager"
                                    fetchpriority="high"
                                    decoding="async"
                                />
                            )}
                        </div>
                        <div className="thumbnail-track">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    className={`thumb-btn ${activeImage === index ? 'active' : ''}`}
                                    onClick={() => setActiveImage(index)}
                                    aria-label={`View image ${index + 1}`}
                                >
                                    <img
                                        src={getOptimizedImage(img, { width: 400 })}
                                        alt={`${product.name} ${index + 1}`}
                                        loading="lazy"
                                        fetchpriority="low"
                                        decoding="async"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="product-info-modern">
                        <h1 className="product-title">{product.name}</h1>

                        <div className="price-block">
                            <span className="currency-symbol">AED</span>
                            <span className="current-price">{Number(product.price).toFixed(2)}</span>
                        </div>

                        <div className="category-section">
                            <p className="sub-category">{product.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                        </div>

                        {product.features && product.features.length > 0 && (
                            <div className="info-section features-only">
                                <ul className="feature-list">
                                    {product.features.map((feature, index) => (
                                        <li key={index}><div className="bullet"></div>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="info-section">
                            <p className="product-desc">{product.description}</p>
                        </div>

                        <div className="purchase-controls">
                            <div className="quantity-selector">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={16} /></button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)}><Plus size={16} /></button>
                            </div>

                            <div className="action-buttons">
                                <button className="add-cart-btn">
                                    <ShoppingCart size={20} /> Add to Cart
                                </button>
                                <button className="icon-action-btn" aria-label="Add to Wishlist"><Heart size={20} /></button>
                                <button className="icon-action-btn" aria-label="Share"><Share2 size={20} /></button>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
