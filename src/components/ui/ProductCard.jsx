import React from 'react';
import './ProductCard.css';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
    const isFeatured = product.featured || Math.random() > 0.7; // Random featured status

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Add to cart logic here
        console.log('Added to cart:', product.name);
    };

    return (
        <div className="product-card">
            <Link to={`/product/${product.id}`} className="product-card-link">
                <div className="product-image-wrapper">
                    {isFeatured && <span className="product-badge">Featured</span>}
                    <img src={product.images[0]} alt={product.name} loading="lazy" />
                </div>
                <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-pricing">
                        <span className="current-price">${product.price}</span>
                    </div>
                </div>
            </Link>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <ShoppingCart size={18} />
                ADD TO CART
            </button>
        </div>
    );
};

export default ProductCard;
