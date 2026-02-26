
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import './Home.css';
import { ChevronLeft, ChevronRight, ArrowRight, Phone, Mail, MapPin, Send } from 'lucide-react';
import defaultCatImg from '../assets/img.png';
import prd1 from '../assets/prd1.png';
import prd2 from '../assets/prd2.png';
import prd3 from '../assets/prd3.png';
import prd4 from '../assets/prd4.png';
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

/* ── Hero slides ──────────────────────────────────────── */
const HERO_SLIDES = [
    { img: banner1, alt: 'Banner 1' },
    { img: banner2, alt: 'Banner 2' },
    { img: banner3, alt: 'Banner 3' },
];



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

const getCatImage = (id = '') => CAT_IMAGES[id] || defaultCatImg;

/* ── Home Component ───────────────────────────────────── */
const Home = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(5);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const timerRef = useRef(null);
    const categoryGridRef = useRef(null);

    const scrollCategories = (direction) => {
        if (categoryGridRef.current) {
            const scrollAmount = categoryGridRef.current.clientWidth;
            categoryGridRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Auto-advance hero
    useEffect(() => {
        timerRef.current = setInterval(() => setActiveSlide(s => (s + 1) % HERO_SLIDES.length), 4500);
        return () => clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
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

        const productImages = [prd1, prd2, prd3, prd4];

        const dummyProducts = Array.from({ length: 24 }).map((_, i) => ({
            id: `dummy-${i}`,
            name: `Professional Tool ${i + 1}`,
            price: (Math.random() * 200 + 50).toFixed(2),
            category: dummyCategories[i % dummyCategories.length].id,
            images: [productImages[i % productImages.length]],
            is_featured: Math.random() > 0.8
        }));

        setCategories(dummyCategories);
        setProducts(dummyProducts);
        setLoading(false);
    }, []);

    const prevSlide = () => {
        clearInterval(timerRef.current);
        setActiveSlide(s => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    };
    const nextSlide = () => {
        clearInterval(timerRef.current);
        setActiveSlide(s => (s + 1) % HERO_SLIDES.length);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="home-page">

            {/* ── Hero + Side Promos ──────────────────────── */}
            <section className="hero-section">
                <div className="hero-inner">
                    {/* Main Banner Slider */}
                    <div className="hero-slider">
                        <div
                            className="slides-track"
                            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                        >
                            {HERO_SLIDES.map((slide, i) => (
                                <div
                                    key={i}
                                    className="slide"
                                >
                                    <div className="slide-banner-wrapper">
                                        <img
                                            src={slide.img}
                                            alt={slide.alt}
                                            className="banner-image"
                                            loading={i === 0 ? "eager" : "lazy"}
                                            fetchpriority={i === 0 ? "high" : "low"}
                                            decoding="async"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Arrows */}
                        <button className="slider-arrow left" onClick={prevSlide} aria-label="Previous">
                            <ChevronLeft size={20} />
                        </button>
                        <button className="slider-arrow right" onClick={nextSlide} aria-label="Next">
                            <ChevronRight size={20} />
                        </button>

                        {/* Dots */}
                        <div className="slider-dots">
                            {HERO_SLIDES.map((_, i) => (
                                <button
                                    key={i}
                                    className={`dot ${activeSlide === i ? 'active' : ''}`}
                                    onClick={() => setActiveSlide(i)}
                                    aria-label={`Slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Top Categories Grid ─────────────────────── */}
            <section className="top-categories-section">
                <div className="container">
                    <h2 className="section-title">Top Categories</h2>
                    {loading ? (
                        <div className="spinner" />
                    ) : (
                        <div className="top-categories-wrapper">
                            <button className="cat-nav-btn left" onClick={() => scrollCategories('left')} aria-label="Previous categories">
                                <ChevronLeft size={24} color="#555" />
                            </button>

                            <div className="top-categories-grid" ref={categoryGridRef}>
                                {categories.map((cat) => (
                                    <Link key={cat.id} to={`/category/${cat.id}`} className="top-cat-card">
                                        <div className="top-cat-image">
                                            <img
                                                src={getCatImage(cat.id)}
                                                alt={cat.name}
                                                loading="lazy"
                                                decoding="async"
                                                fetchpriority="low"
                                            />
                                        </div>
                                        <span className="top-cat-name">{cat.name}</span>
                                    </Link>
                                ))}
                            </div>

                            <button className="cat-nav-btn right" onClick={() => scrollCategories('right')} aria-label="Next categories">
                                <ChevronRight size={24} color="#555" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Products by Category Rows ───────────────── */}
            {!loading && (
                <>
                    {categories.slice(0, visibleCount).map((category, index) => {
                        const catProducts = products.filter(p => p.category === category.id).slice(0, 6);
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
                                                <span>Image Placeholder 1 (Large)</span>
                                            </div>
                                            <div className="banner-placeholder banner-narrow">
                                                <span>Image Placeholder 2 (Small)</span>
                                            </div>
                                            {/* Bottom Row */}
                                            <div className="banner-placeholder banner-narrow">
                                                <span>Image Placeholder 3 (Small)</span>
                                            </div>
                                            <div className="banner-placeholder banner-wide">
                                                <span>Image Placeholder 4 (Large)</span>
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

            {/* ── Contact Section ─────────────────────────── */}
            <section id="contact" className="contact-section">
                <div className="container contact-inner">
                    <div className="contact-info">
                        <h2>Get In Touch</h2>
                        <p className="contact-intro">We're here to help with your industrial tool needs.</p>
                        <div className="info-items">
                            <div className="info-item">
                                <MapPin size={20} color="var(--accent)" />
                                <div><strong>Address</strong><p>123 Industrial Ave, Dubai, UAE</p></div>
                            </div>
                            <div className="info-item">
                                <Phone size={20} color="var(--accent)" />
                                <div><strong>Phone</strong><p>+971-4-295-7557</p></div>
                            </div>
                            <div className="info-item">
                                <Mail size={20} color="var(--accent)" />
                                <div><strong>Email</strong><p>info@suntric.com</p></div>
                            </div>
                        </div>
                    </div>
                    <div className="contact-form-wrapper">
                        <h2>Send a Message</h2>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <input type="text" placeholder="Your Name" value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            <input type="email" placeholder="Your Email" value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                            <input type="text" placeholder="Subject" value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })} required />
                            <textarea rows="5" placeholder="Your Message" value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })} required />
                            <button type="submit" className="btn btn-primary">
                                <Send size={16} /> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
