
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import './Home.css';
import { ChevronLeft, ChevronRight, ArrowRight, Phone, Mail, MapPin, Send } from 'lucide-react';
import defaultCatImg from '../assets/img.png';
import catProtective from '../assets/catogeries/protective equipments.png';
import catStorage from '../assets/catogeries/industrial storage.jpeg';
import catSpill from '../assets/catogeries/spill control.jpeg';
import catRoadSafety from '../assets/catogeries/road safety and signgage.jpeg';
import catLifting from '../assets/catogeries/lifting eqp.jpeg';
import catMeasurement from "../assets/catogeries/measuremnt tools'.jpeg";
import catFire from '../assets/catogeries/fire estinguishers.jpeg';
import catPowerTools from '../assets/catogeries/power tools.png';
import banner1 from '../assets/banners/1.png';
import banner2 from '../assets/banners/2.png';
import banner3 from '../assets/banners/3.png';





/* ── Category image mapping ──────────────────────────── */
const CAT_IMAGES = {
    'protective-equipments': catProtective,
    'industrial-storage': catStorage,
    'spill-control': catSpill,
    'road-safety': catRoadSafety,
    'lifting': catLifting,
    'measurement': catMeasurement,
    'fire-extinguishers': catFire,
    'power-tools': catPowerTools,
};

const getCatImage = (cat) => {
    if (!cat) return null;
    if (cat.image_url) return cat.image_url; // Use DB thumbnail first

    const slug = (cat.name || '').toLowerCase().replace(/\s+/g, '-');
    // Map some known mismatches
    if (slug.includes('protective')) return catProtective;
    if (slug.includes('storage')) return catStorage;
    if (slug.includes('spill')) return catSpill;
    if (slug.includes('road')) return catRoadSafety;
    if (slug.includes('lifting')) return catLifting;
    if (slug.includes('measur')) return catMeasurement;
    if (slug.includes('fire')) return catFire;
    if (slug.includes('power')) return catPowerTools;
    return CAT_IMAGES[slug] || catProtective; // Fallback image
};
/* ── Home Component ───────────────────────────────────── */
const Home = () => {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(5);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const categoryGridRef = useRef(null);
    const brandGridRef = useRef(null);

    const scrollCategories = (direction) => {
        if (categoryGridRef.current) {
            const scrollAmount = categoryGridRef.current.clientWidth;
            categoryGridRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const scrollBrands = (direction) => {
        if (brandGridRef.current) {
            const scrollAmount = 340; // Approx 2 cards width
            brandGridRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };




    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                // Fetch real categories and products
                const [cats, prods] = await Promise.all([
                    productService.getCategories(),
                    productService.getAllProducts(1, 100) // Fetch top 100 products for home page
                ]);

                setCategories(cats || []);
                setProducts(prods.data || []);
            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);



    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="home-promo-page">
            {/* ── Top Banner Section ─────────────────────────────── */}
            <section className="promo-top-banner">
                <img src="/images/banner.jpeg" alt="Promo Banner" loading="eager" />
            </section>

            {/* ── 3x3 Categories Grid ────────────────────────────── */}
            <section className="promo-categories-section">
                <div className="container">
                    {loading ? (
                        <div className="spinner" />
                    ) : (
                        <>
                            <h2 className="promo-categories-title">Top Categories</h2>
                            <div className="promo-categories-grid">
                            {categories.slice(0, 32).map((cat) => (
                                <Link key={cat.id} to={`/category/${cat.id}`} className="hero-cat-card">
                                    <div className="hero-cat-image">
                                        <img
                                            src={getCatImage(cat)}
                                            alt={cat.name}
                                            loading="eager"
                                            decoding="async"
                                        />
                                    </div>
                                    <span className="hero-cat-name">{cat.name}</span>
                                </Link>
                            ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* ── Shop By Brands Section ──────────────────────────── */}
            <section className="brands-section">
                <div className="container">
                    <h2 className="brands-title">Shop By Brands</h2>
                    <div className="brands-marquee-container">
                        <div className="brands-marquee-track">
                            {['STANLEY', 'DEWALT', 'MILWAUKEE', 'HITACHI', 'BOSH', 'BRENNENSTUHL', 'MAKITA', 'EUROMATE', 'STANLEY', 'DEWALT', 'MILWAUKEE', 'HITACHI', 'BOSH', 'BRENNENSTUHL', 'MAKITA', 'EUROMATE'].map((brand, index) => (
                                <div key={index} className="brand-card">
                                    <span className="brand-text">{brand}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Custom Banner Grid ─────────────────────────────────── */}
            <section className="custom-banner-section">
                <div className="container">
                    <div className="custom-banner-grid">
                        <Link to="/category/1" className="banner-placeholder banner-wide">
                            <img src={banner1} alt="Power Tools" loading="lazy" />
                        </Link>
                        <Link to="/category/2" className="banner-placeholder banner-narrow">
                            <img src={banner2} alt="Safety Equipment" loading="lazy" />
                        </Link>
                        <Link to="/category/3" className="banner-placeholder banner-narrow">
                            <img src={banner3} alt="Workplace Safety Solutions" loading="lazy" />
                        </Link>
                        <Link to="/category/1" className="banner-placeholder banner-wide">
                            <img src={banner1} alt="Power Tools" loading="lazy" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Category Product Rows & Promo Footer ──────────────── */}
            {categories.slice(0, 5)
                .filter(category => {
                    const categoryProducts = products.filter(p => p.category_id === category.id || p.category === category.id).slice(0, 10);
                    return categoryProducts.length > 0;
                })
                .map((category, index, filteredArray) => {
                    const categoryProducts = products.filter(p => p.category_id === category.id || p.category === category.id).slice(0, 10);

                    return (
                        <React.Fragment key={category.id}>
                            <section className="product-row-section">
                                <div className="container">
                                    <div className="row-header">
                                        <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', fontSize: '1.25rem', color: '#1A2332' }}>
                                            <span style={{ display: 'inline-block', width: '4px', height: '24px', background: '#3b82f6', marginRight: '10px', borderRadius: '2px' }}></span>
                                            {category.name}
                                        </h3>
                                        <Link to={`/category/${category.id}`} className="view-all-link">
                                            View All <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                    <div className="products-row-scroll-wrapper">
                                        <div className="products-row-scroll">
                                            {categoryProducts.map(product => (
                                                <div key={product.id} className="product-col">
                                                    <ProductCard product={product} />
                                                </div>
                                            ))}
                                            <div className="product-col">
                                                <Link to={`/category/${category.id}`} style={{ textDecoration: 'none' }}>
                                                    <div className="view-all-card">
                                                        <span>View All</span>
                                                        <ArrowRight size={24} />
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Show Promo Footer after the 2nd product row (index === 1) */}
                            {index === 1 && (
                                <section className="promo-footer" style={{ marginTop: 0 }}>
                                    <div className="promo-footer-content">
                                        <div className="promo-left-side">
                                            <div className="promo-order-btn">ORDER NOW</div>
                                            <div className="promo-contact-info">
                                                <Phone size={24} color="#111" />
                                                <div>
                                                    <strong>+ 12 345 67890</strong>
                                                    <p>www.websitename.com</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="promo-address-info">
                                            <div style={{ textAlign: 'right' }}>
                                                <strong>123 Lorem Ipsum Supermarket</strong>
                                                <p>5th floor, 12 lorem ipsum city</p>
                                            </div>
                                            <MapPin size={32} color="#111" />
                                        </div>
                                    </div>
                                </section>
                            )}
                        </React.Fragment>
                    );
                })}
        </div>
    );
};

export default Home;
