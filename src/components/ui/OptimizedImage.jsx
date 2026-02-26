import React, { useState } from 'react';

// Extracted Cloudinary Optimizer
export function getOptimizedImage(url, options = {}) {
    if (!url || typeof url !== 'string') return url;
    if (!url.includes('/upload/')) return url;
    const parts = url.split('/upload/');
    const width = options.width ? `w_${options.width},` : '';
    // Apply format auto (f_auto) for WebP/Avif and quality auto (q_auto)
    const transform = `${width}c_fill,f_auto,q_auto`;
    return `${parts[0]}/upload/${transform}/${parts[1]}`;
}

/**
 * OptimizedImage
 * Core image component to prevent layout shifts and enforce lazy-loading best practices.
 * 
 * @param {string} src - Image URL (local or remote)
 * @param {string} alt - Alt text
 * @param {string} className - Additional CSS classes
 * @param {boolean} priority - Eagerly load (disables lazy-loading for hero spots)
 * @param {number|string} width - Intrinsic width (required for CLS prevention)
 * @param {number|string} height - Intrinsic height (required for CLS prevention)
 * @param {string} fallbackSrc - Optional fallback image
 * @param {object} cloudOptions - Options for Cloudinary transformation
 */
const OptimizedImage = ({ 
    src, 
    alt, 
    className = '', 
    priority = false, 
    width, 
    height, 
    fallbackSrc = '/placeholder.png', // Or any generic grey box asset you prefer
    cloudOptions = {},
    ...props 
}) => {
    const [imgSrc, setImgSrc] = useState(() => {
        // Optimize URL immediately if it's Cloudinary
        return src?.includes('/upload/') ? getOptimizedImage(src, cloudOptions) : src;
    });

    const [hasError, setHasError] = useState(false);

    const handleError = (e) => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
        }
    };

    return (
        <img
            src={imgSrc || fallbackSrc}
            alt={alt || "Image"}
            className={className}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : 'auto'}
            width={width} // Prevents Layout Shift (CLS)
            height={height}
            onError={handleError}
            {...props}
        />
    );
};

export default OptimizedImage;
