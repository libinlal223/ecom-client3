
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import './CategoryPage.css';
import { ChevronDown, AlignJustify, LayoutGrid, Grid3x3, Grid, List, ArrowLeft } from 'lucide-react';

// Cloudinary Image Optimization Helper
export function getOptimizedImage(url, options = {}) {
    if (!url || typeof url !== 'string') return url;
    if (!url.includes('/upload/')) return url;
    const parts = url.split('/upload/');
    const width = options.width ? `w_${options.width},` : '';
    const transform = `${width}c_fill,f_auto,q_auto`;
    return `${parts[0]}/upload/${transform}/${parts[1]}`;
}


const CategoryPage = () => {
    const { categoryId, subcategoryId } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;
    const [totalCount, setTotalCount] = useState(0);

    const fetchProducts = async (pageToFetch) => {
        setLoading(true);
        try {
            const res = await productService.getAllProducts(pageToFetch, pageSize, categoryId, subcategoryId);
            setProducts(res.data || []);
            setTotalCount(res.total || 0);
            setCurrentPage(res.page || 1);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            // Scroll to top when navigating to category page
            window.scrollTo(0, 0);

            setLoading(true);
            try {
                // Fetch Categories
                const cats = await productService.getCategories();
                const cat = cats.find(c => c.id === categoryId) || { id: categoryId, name: categoryId.replace(/-/g, ' ') };
                setCategory(cat);

                // Fetch Subcategories
                const subs = await productService.getSubcategories(categoryId);
                setSubcategories(subs || []);

                // Fetch optimized paginated products
                await fetchProducts(1);
            } catch (error) {
                console.error("Initialization error:", error);
                setLoading(false);
            }
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId, subcategoryId]);

    if (!category && !loading) {
        return <div className="loading-page">Category not found</div>;
    }

    if (loading && currentPage === 1 && products.length === 0) {
        return <div className="loading-page">Loading...</div>;
    }

    return (
        <div className="category-page">
            {/* Category Header */}
            <section className="category-hero-modern">
                <div className="container">
                    <button onClick={() => navigate(-1)} className="back-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center', marginBottom: '1rem', color: '#4b5563' }}>
                        <ArrowLeft size={16} style={{ marginRight: '4px' }} /> Back
                    </button>
                    <h1 className="category-title">
                        {subcategoryId ? subcategoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : category?.name}
                    </h1>
                </div>
            </section>

            <div className="container category-layout-modern">
                {/* Sidebar for Subcategories */}
                {!subcategoryId && subcategories.length > 0 && (
                    <aside className="category-sidebar">
                        <ul className="sidebar-subcat-list">
                            {subcategories.map((subcat, index) => (
                                <li key={subcat.id || index}>
                                    <Link
                                        to={`/category/${categoryId}/${subcat.id}`}
                                        className="sidebar-subcat-link"
                                    >
                                        {subcat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </aside>
                )}

                {/* Main Content Area */}
                <main className="category-main-content">
                    {/* Products Grid */}
                    <section className="category-products">
                        <div className={`products-grid ${!subcategoryId && subcategories.length > 0 ? 'grid-3-col' : 'grid-4-col'}`}>
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {loading && <div className="loader">Loading products...</div>}

                        {/* Pagination UI Block */}
                        {!loading && totalCount > pageSize && (
                            <div className="pagination-block" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        window.scrollTo(0, 0);
                                        fetchProducts(currentPage - 1);
                                    }}
                                    disabled={currentPage === 1}
                                    style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                                >
                                    Previous
                                </button>

                                <span>Page {currentPage} of {Math.ceil(totalCount / pageSize)}</span>

                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        window.scrollTo(0, 0);
                                        fetchProducts(currentPage + 1);
                                    }}
                                    disabled={currentPage >= Math.ceil(totalCount / pageSize)}
                                    style={{ opacity: currentPage >= Math.ceil(totalCount / pageSize) ? 0.5 : 1, cursor: currentPage >= Math.ceil(totalCount / pageSize) ? 'not-allowed' : 'pointer' }}
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {!loading && products.length === 0 && (
                            <div className="end-message">
                                No products found in this category yet.
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default CategoryPage;
