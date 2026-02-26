import React from 'react';
import './ProductCard.css';
import { Link } from 'react-router-dom';

export function getOptimizedImage(url, options = {}) {
    if (!url || typeof url !== 'string') return url;
    if (!url.includes('/upload/')) return url;
    const parts = url.split('/upload/');
    const width = options.width ? `w_${options.width},` : '';
    const transform = `${width}c_fill,f_auto,q_auto`;
    return `${parts[0]}/upload/${transform}/${parts[1]}`;
}

const ProductCard = ({ product }) => {
    const hasImage = product.images && product.images.length > 0 && product.images[0];
    const optimizedImageUrl = hasImage ? getOptimizedImage(product.images[0], { width: 400 }) : '';

    return (
        <Link to={`/product/${product.id}`} className="product-card">
            <div className="pc-image-wrap">
                {hasImage
                    ? <img
                        src={optimizedImageUrl}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        fetchpriority="low"
                    />
                    : <div className="pc-no-image">No Image</div>
                }
            </div>
            <div className="pc-info">
                <h3 className="pc-name">{product.name}</h3>
                <div className="pc-price">
                    <span>${Number(product.price).toFixed(2)}</span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
