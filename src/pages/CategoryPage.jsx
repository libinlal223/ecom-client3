
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import './CategoryPage.css';

// Helper for subcategory images
const getSubcategoryImage = (index) => {
    const images = [
        'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400', // Drill
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400', // Factory tools
        'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=400', // Hammer
        'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=400', // Measuring
        'https://images.unsplash.com/photo-1588611910603-9e48c15db64b?auto=format&fit=crop&q=80&w=400', // Battery
        'https://images.unsplash.com/photo-1594950882798-e7e29aa7cb35?auto=format&fit=crop&q=80&w=400', // Storage
    ];
    return images[index % images.length];
};


const CategoryPage = () => {
    const { categoryId, subcategoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]); // Store all products
    const [category, setCategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const init = async () => {
            // Scroll to top when navigating to category page
            window.scrollTo(0, 0);

            setLoading(true);
            try {
                // Fetch basic data
                const [cats, subs] = await Promise.all([
                    productService.getCategories(),
                    productService.getSubcategories(categoryId)
                ]);

                const cat = cats.find(c => c.id === categoryId);
                setCategory(cat);
                setSubcategories(subs);

                // Fetch products
                const res = await productService.getAllProducts(1, 20, categoryId);
                setAllProducts(res.data);

                // Filter by subcategory if subcategoryId exists
                if (subcategoryId) {
                    const subcategoryName = subcategoryId.replace(/-/g, ' ');
                    // Simple filter matching
                    const filtered = res.data.filter(product =>
                        product.subcategory === subcategoryId || // Exact match (best)
                        product.name.toLowerCase().includes(subcategoryName.toLowerCase().split(' ')[0]) || // Fallback name match
                        (product.subcategory && product.subcategory.toLowerCase().includes(subcategoryName.toLowerCase())) // Fallback partial subcategory
                    );
                    setProducts(filtered.length > 0 ? filtered : []);
                } else {
                    setProducts(res.data);
                }

                setHasMore(res.hasMore);
                setPage(1);
            } catch (error) {
                console.error("Error loading category data:", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [categoryId, subcategoryId]);

    const loadMore = async () => {
        if (loading) return;
        setLoading(true);
        const nextPage = page + 1;
        const res = await productService.getAllProducts(nextPage, 20, categoryId);
        setProducts(prev => [...prev, ...res.data]);
        setPage(nextPage);
        setHasMore(res.hasMore);
        setLoading(false);
    };

    if (!category && !loading) {
        return <div className="loading-page">Category not found</div>;
    }

    if (loading && page === 1) {
        return <div className="loading-page">Loading...</div>;
    }

    return (
        <div className="category-page">
            {/* Category Header */}
            <section className="category-hero">
                <div className="container">
                    {subcategoryId ? (
                        <>
                            <Link to={`/category/${categoryId}`} className="back-link">← Back to {category?.name}</Link>
                            <h1>{subcategoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h1>
                            <p>Browse our selection of {subcategoryId.replace(/-/g, ' ')}</p>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="back-link">← Back to Home</Link>
                            <h1>{category?.name}</h1>
                            <p>Explore our complete range of {category?.name?.toLowerCase()}</p>
                        </>
                    )}
                </div>
            </section>

            {/* Subcategories Section - Only show on main category page */}
            {!subcategoryId && subcategories.length > 0 && (
                <section className="subcategories-section">
                    <div className="container">
                        <div className="subcategories-grid">
                            {subcategories.map((subcat, index) => (
                                <Link
                                    key={subcat.id || index}
                                    to={`/category/${categoryId}/${subcat.id}`}
                                    className="subcategory-card"
                                >
                                    <div className="subcat-image-wrapper">
                                        <img src={getSubcategoryImage(index)} alt={subcat.name} loading="lazy" />
                                    </div>
                                    <div className="subcat-info">
                                        <h3>{subcat.name}</h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Products Grid */}
            <section className="category-products">
                <div className="container">
                    <div className="products-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {loading && <div className="loader">Loading more products...</div>}

                    {!loading && hasMore && (
                        <div className="load-more-container">
                            <button onClick={loadMore} className="btn btn-primary">
                                Load More Products
                            </button>
                        </div>
                    )}

                    {!loading && !hasMore && products.length > 0 && (
                        <div className="end-message">
                            You've viewed all products in this category
                        </div>
                    )}

                    {!loading && products.length === 0 && (
                        <div className="end-message">
                            No products found in this category yet.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default CategoryPage;
