
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const data = await productService.getProductById(id);
            setProduct(data);
            setLoading(false);
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
                <nav className="breadcrumb">
                    <Link to="/">Home</Link> /
                    <Link to={`/category/${product.category}`}>{product.category.replace('-', ' ')}</Link> /
                    <span>{product.name}</span>
                </nav>

                <div className="product-view">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            <img src={product.images[activeImage]} alt={product.name} />
                        </div>
                        <div className="thumbnail-grid">
                            {product.images.map((img, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                                    onClick={() => setActiveImage(index)}
                                >
                                    <img src={img} alt={`${product.name} ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="product-info-panel">
                        <div className="info-header">
                            <span className="stock-status">In Stock</span>
                            <h1>{product.name}</h1>
                            <p className="price">From ${product.price}*</p>
                        </div>

                        <div className="info-description">
                            <h3>Overview</h3>
                            <p>{product.description}</p>
                        </div>

                        <div className="info-features">
                            <h3>Key Features</h3>
                            <ul>
                                {product.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="purchase-actions">
                            <button className="btn btn-primary buy-btn">Add to Bag</button>
                            <p className="disclaimer">* Monthly financing available. See terms for details.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
