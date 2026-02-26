
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { supabase } from '../admin/services/mockDb';
import ProductCard from '../components/ui/ProductCard';
import './CategoryPage.css';
import { ChevronDown, AlignJustify, LayoutGrid, Grid3x3, Grid, List, ArrowLeft } from 'lucide-react';
import defaultCatImg from '../assets/img.png';
import prd1 from '../assets/prd1.png';
import prd2 from '../assets/prd2.png';
import prd3 from '../assets/prd3.png';
import prd4 from '../assets/prd4.png';

// Cloudinary Image Optimization Helper
export function getOptimizedImage(url, options = {}) {
    if (!url || typeof url !== 'string') return url;
    if (!url.includes('/upload/')) return url;
    const parts = url.split('/upload/');
    const width = options.width ? `w_${options.width},` : '';
    const transform = `${width}c_fill,f_auto,q_auto`;
    return `${parts[0]}/upload/${transform}/${parts[1]}`;
}

// Helper for subcategory images
const getSubcategoryImage = (index) => {
    const images = [prd1, prd2, prd3, prd4];
    return images[Math.abs(index) % images.length];
};


const CategoryPage = () => {
    const { categoryId, subcategoryId } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]); // Store all products
    const [category, setCategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;
    const [totalCount, setTotalCount] = useState(0);

    const fetchProducts = async (pageToFetch) => {
        setLoading(true);

        const productImages = [prd1, prd2, prd3, prd4];

        // Dummy Data implementation
        setTimeout(() => {
            const dummyProducts = Array.from({ length: pageSize }).map((_, i) => ({
                id: `dummy-${pageToFetch}-${i}`,
                name: `Professional Tool ${i + 1 + ((pageToFetch - 1) * pageSize)}`,
                price: (Math.random() * 200 + 50).toFixed(2),
                category: categoryId,
                images: [productImages[i % productImages.length]],
                is_featured: Math.random() > 0.8
            }));

            setProducts(dummyProducts);
            setTotalCount(120); // Dummy total count
            setCurrentPage(pageToFetch);
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        const init = async () => {
            // Scroll to top when navigating to category page
            window.scrollTo(0, 0);

            setLoading(true);
            const dummyCategories = [
                { id: 'protective-equipments', name: 'Protective Equipments' },
                { id: 'industrial-storage', name: 'Industrial Storage' },
                { id: 'spill-control', name: 'Spill Control Solutions' },
                { id: 'road-safety', name: 'Road Safety & Signage' },
                { id: 'lifting', name: 'Lifting Equipments' },
                { id: 'measurement', name: 'Precision Measurement Tools' },
                { id: 'surface-protection', name: 'Surface & Dust Protection Materials' },
                { id: 'fire-extinguishers', name: 'Fire Extinguishers' },
                { id: 'wd40', name: 'WD-40 Products' },
                { id: 'adhesives', name: 'Adhesives & Sealants' },
                { id: 'tapes', name: 'Tapes & Surface Protection' },
                { id: 'packaging', name: 'Packaging Tools & Accessories' },
                { id: 'hand-tools', name: 'Hand Tools' },
                { id: 'power-tools', name: 'Power Tools' },
            ];

            const cat = dummyCategories.find(c => c.id === categoryId) || { id: categoryId, name: categoryId.replace(/-/g, ' ') };
            setCategory(cat); // RESTORED state setter

            // Dummy Subcategories to show in UI
            const dummySubcategories = [
                { id: 'cutting', name: 'Cutting (Metal)' },
                { id: 'grinding', name: 'Grinding' },
                { id: 'cordless', name: 'Cordless Power Tools' },
                { id: 'drilling', name: 'Drilling & Fastening' },
                { id: 'heat-gun', name: 'Heat Gun' },
                { id: 'multi-tool', name: 'Multi Tool' },
                { id: 'shears', name: 'Shears' },
            ];

            setSubcategories(dummySubcategories);

            // Fetch optimized paginated products
            fetchProducts(1);
        };
        init();
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
