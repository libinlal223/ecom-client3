
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
        <div className="home-page">



            {/* ── Top Banner Section ─────────────────────────────── */}
            <section className="hero-banner-section">
                <div className="container">
                    <div className="hero-banner-layout">
                        <div className="main-banner">
                            <img src={banner1} alt="Ramadan Promo Banner" loading="eager" />
                        </div>
                        <div className="side-banners">
                            <div className="side-banner">
                                <img src={banner2} alt="Cabinet Hardware Promo" loading="eager" />
                            </div>
                            <div className="side-banner">
                                <img src={banner3} alt="Hettich Promo Banner" loading="eager" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Top Categories Grid ─────────────────────── */}
            <section className="top-categories-section">
                <div className="container">
                    {loading ? (
                        <div className="spinner" />
                    ) : (
                        <>
                            <h2 className="top-categories-title">Top Categories</h2>
                            <div className="hero-categories-grid">
                            {categories.slice(0, 16).map((cat) => (
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

            {/* ── Shop By Brands Section ─────────────────────── */}
            <section className="brands-section">
                <div className="container">
                    <h2 className="brands-title">Shop By Brands</h2>
                    <div className="brands-marquee-container">
                        <div className="brands-marquee-track">
                            {[
                                "Brennenstuhl", "Makita", "Euromatic", "KC POWER", 
                                "STONY", "AR BLUE CLEAN", "KITO", "Stanley",
                                "DeWalt", "Milwaukee", "Hitachi", "Bosh",
                                // Duplicated for seamless loop
                                "Brennenstuhl", "Makita", "Euromatic", "KC POWER", 
                                "STONY", "AR BLUE CLEAN", "KITO", "Stanley",
                                "DeWalt", "Milwaukee", "Hitachi", "Bosh" 
                            ].map((brand, i) => (
                                <div key={i} className="brand-card">
                                    <span className="brand-text">{brand}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Products by Category Rows ───────────────── */}
            {!loading && (
                <>
                    {categories.slice(0, visibleCount).map((category, index) => {
                        // Match products by direct category_id OR via subcategory's parent category
                        const catProducts = products.filter(p =>
                            p.category === category.id
                        ).slice(0, 6);
                        if (catProducts.length === 0) return null;
                        return (
                            <React.Fragment key={category.id}>
                                <section className="product-row-section">
                                    <div className="container">
                                        <div className="row-header">
                                            <h2 className="section-title">{category.name}</h2>
                                            <Link to={`/category/${category.id}`} className="view-all-link">
                                                View All <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                        <div className="products-row-scroll-wrapper">
                                            <div className="products-row-scroll">
                                                {catProducts.map(product => (
                                                    <div key={product.id} className="product-col">
                                                        <ProductCard product={product} />
                                                    </div>
                                                ))}
                                                <div className="product-col">
                                                    <Link to={`/category/${category.id}`} className="view-all-card">
                                                        <span>View All</span>
                                                        <ArrowRight size={20} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Insert layout after 2nd category (index 1) */}
                                {index === 1 && (
                                    <section className="custom-banner-section container">
                                        <div className="custom-banner-grid">
                                            {/* Top Row */}
                                            <div className="banner-placeholder banner-wide">
                                                <img src={banner1} alt="Banner 1" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div className="banner-placeholder banner-narrow">
                                                <img src={banner2} alt="Banner 2" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            {/* Bottom Row */}
                                            <div className="banner-placeholder banner-narrow">
                                                <img src={banner3} alt="Banner 3" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div className="banner-placeholder banner-wide">
                                                <img src={banner1} alt="Banner 4" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </React.Fragment>
                        );
                    })}

                    <div className="container" style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0 3rem' }}>
                        {visibleCount < categories.length ? (
                            <button
                                className="btn btn-primary"
                                onClick={() => setVisibleCount(prev => prev + 5)}
                            >
                                Show More Categories
                            </button>
                        ) : categories.length > 5 ? (
                            <button
                                className="btn btn-secondary"
                                onClick={() => setVisibleCount(5)}
                            >
                                Show Less
                            </button>
                        ) : null}
                    </div>
                </>
            )}


        </div>
    );
};

export default Home;
