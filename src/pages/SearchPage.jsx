import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import { ArrowLeft } from 'lucide-react';
import './CategoryPage.css';

const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || searchParams.get('search') || '';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await productService.getAllProducts(1, 100, null, null, query);
                setProducts(res.data || []);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    return (
        <div className="category-page">
            <section className="category-hero-modern">
                <div className="container">
                    <button onClick={() => navigate(-1)} className="back-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center', marginBottom: '1rem', color: '#4b5563' }}>
                        <ArrowLeft size={16} style={{ marginRight: '4px' }} /> Back
                    </button>
                    <h1 className="category-title">
                        Search Results for "{query}"
                    </h1>
                </div>
            </section>

            <div className="container category-layout-modern">
                <main className="category-main-content">
                    <section className="category-products" style={{ width: '100%' }}>
                        {loading ? (
                            <div className="loader" style={{ textAlign: 'center', margin: '3rem 0' }}>Searching...</div>
                        ) : products.length > 0 ? (
                            <div className="products-grid grid-4-col">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="end-message" style={{ textAlign: 'center', padding: '4rem 0', color: '#6b7280', fontSize: '1.1rem' }}>
                                No products found matching your search term. <br/> Try searching for a different keyword.
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default SearchPage;
