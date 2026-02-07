
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import './Home.css';
import { ArrowRight, ArrowLeft, Mail, Phone, MapPin, Send } from 'lucide-react';

const Home = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            const cats = await productService.getCategories();
            setCategories(cats);

            const res = await productService.getAllProducts(1, 200, null); // Increased limit to show multiple categories
            setProducts(res.data);
            setHasMore(res.hasMore);
            setLoading(false);
        };
        init();
    }, []);

    const handleCategoryChange = async (catId) => {
        setActiveCategory(catId);
        setLoading(true);
        setPage(1);
        setProducts([]);
        const res = await productService.getAllProducts(1, 10, catId);
        setProducts(res.data);
        setHasMore(res.hasMore);
        setLoading(false);
    };

    const loadMore = async () => {
        if (loading) return;
        const nextPage = page + 1;
        const res = await productService.getAllProducts(nextPage, 10, activeCategory);
        setProducts(prev => [...prev, ...res.data]);
        setPage(nextPage);
        setHasMore(res.hasMore);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="home-page">
            {/* Hero Carousel Section */}
            <div className="hero-carousel">
                {/* Slides Container */}
                <div style={{ transform: `translateX(-${activeSlide * 100}%)`, display: 'flex', width: '100%', transition: 'transform 0.5s ease-in-out' }}>

                    {/* Slide 1: Right Image */}
                    <div className="carousel-slide">
                        <div className="container slide-content layout-right">
                            <div className="hero-text">
                                <span className="slide-number">01</span>
                                <h1>TOOLS  &<br />MACHINES</h1>
                                <p>20V MAX* LITHIUM ION BRUSHLESS</p>
                            </div>
                            <div className="hero-image">
                                <img src="/images/categories/compressor.png" alt="Drills" />
                            </div>
                        </div>
                    </div>

                    {/* Slide 2: Left Image */}
                    <div className="carousel-slide">
                        <div className="container slide-content layout-left">
                            <div className="hero-text">
                                <span className="slide-number">02</span>
                                <h1>MEASURING<br />& LAYOUT<br />TOOLS</h1>
                                <p>PRECISION LASER TECHNOLOGY FOR PROS</p>
                            </div>
                            <div className="hero-image">
                                <img src="https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=1000" alt="Measuring" />
                            </div>
                        </div>
                    </div>

                    {/* Slide 3: Right Image */}
                    <div className="carousel-slide">
                        <div className="container slide-content layout-right">
                            <div className="hero-text">
                                <span className="slide-number">03</span>
                                <h1>TOOLS<br /> &<br />LEVRS</h1>
                                <p>EXTREME DUTY CONCRETE BREAKING</p>
                            </div>
                            <div className="hero-image">
                                <img src="/images/categories/drill.png" alt="Hammer" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Navigation Controls */}
                <div className="carousel-nav">
                    <button className="nav-btn" onClick={() => setActiveSlide(prev => prev === 2 ? 0 : prev + 1)}>
                        <ArrowRight size={24} />
                    </button>
                </div>

                {/* Dots */}
                <div className="carousel-dots">
                    {[0, 1, 2].map(idx => (
                        <div key={idx} className={`dot ${activeSlide === idx ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}></div>
                    ))}
                </div>
            </div>

            {/* About Us Section */}
            <section id="about" className="about-section">
                <div className="container about-content">
                    <div className="about-text">
                        <div className="about-accent"></div>
                        <h2>BUILT FOR<br /><span>PROS</span></h2>
                        <p>For over 50 years, we've been engineering tools that define industry standards. Durability, power, and precision are not just features—they are our promise.</p>
                        <button className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>READ OUR STORY</button>
                    </div>
                    <div className="about-image">
                        <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" alt="Factory" />
                    </div>
                </div>
            </section>

            {/* Featured Categories Section */}
            <section className="featured-categories-section">
                <div className="container">
                    <h2 className="section-title-label">Featured Categories</h2>
                    <div className="categories-carousel-wrapper">
                        <button
                            className="category-scroll-btn left"
                            onClick={(e) => {
                                const scroll = e.currentTarget.parentElement.querySelector('.categories-scroll');
                                scroll.scrollBy({ left: -300, behavior: 'smooth' });
                            }}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="categories-scroll">
                            {[
                                { id: 'power-tools', name: 'Power Tools', image: '/images/categories/drill.png' },
                                { id: 'power-tools', name: 'Power Tools', image: '/images/categories/grinder.png' },
                                { id: 'power-tools', name: 'Power Tools', image: '/images/categories/compressor.png' },
                                { id: 'power-tools', name: 'Power Tools', image: '/images/categories/drill.png' },
                                { id: 'automotive', name: 'Automotive', image: '/images/categories/grinder.png' },
                                { id: 'hand-tools', name: 'Hand Tools', image: '/images/categories/compressor.png' },
                                { id: 'electrical', name: 'Electrical', image: '/images/categories/drill.png' },
                                { id: 'hand-tools', name: 'Hand Tools', image: '/images/categories/grinder.png' },
                                { id: 'power-tools', name: 'Power Tools', image: '/images/categories/compressor.png' },
                                { id: 'electrical', name: 'Electrical', image: '/images/categories/drill.png' },
                                { id: 'hand-tools', name: 'Hand Tools', image: '/images/categories/grinder.png' },
                                { id: 'power-tools', name: 'Power Tools', image: '/images/categories/compressor.png' },
                                { id: 'hand-tools', name: 'Hand Tools', image: '/images/categories/drill.png' },
                                { id: 'hand-tools', name: 'Hand Tools', image: '/images/categories/grinder.png' },
                                { id: 'electrical', name: 'Electrical', image: '/images/categories/compressor.png' },
                            ].map((cat, index) => (
                                <Link key={`${cat.id}-${index}`} to={`/category/${cat.id}`} className="featured-category-card">
                                    <div className="cat-image-wrapper">
                                        <img src={cat.image} alt={cat.name} loading="lazy" />
                                    </div>
                                    <div className="cat-info">
                                        <h3>{cat.name}</h3>
                                        <p className="explore-link">EXPLORE ALL »</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <button
                            className="category-scroll-btn right"
                            onClick={(e) => {
                                const scroll = e.currentTarget.parentElement.querySelector('.categories-scroll');
                                scroll.scrollBy({ left: 300, behavior: 'smooth' });
                            }}
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured Products Showcase */}
            <section className="featured-showcase">
                <div className="container">
                    <div className="showcase-grid">
                        {/* Large Featured Item */}
                        <div className="showcase-item large" style={{ backgroundImage: `url(${products[0]?.images[0] || 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=1200'})` }}>
                            <div className="showcase-overlay">
                                <span className="showcase-label">FEATURED</span>
                                <h3>{products[0]?.name || 'Professional Drill Set'}</h3>
                                <p>{products[0]?.category || 'Power Tools'}</p>
                            </div>
                        </div>

                        {/* Medium Item */}
                        <div className="showcase-item medium" style={{ backgroundImage: `url(${products[1]?.images[0] || 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=800'})` }}>
                            <div className="showcase-overlay">
                                <h3>{products[1]?.name || 'Heavy Duty Hammer'}</h3>
                                <p>{products[1]?.category || 'Hand Tools'}</p>
                            </div>
                        </div>

                        {/* Second Medium Item */}
                        <div className="showcase-item medium" style={{ backgroundImage: `url(${products[2]?.images[0] || 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800'})` }}>
                            <div className="showcase-overlay">
                                <span className="showcase-label">NEW</span>
                                <h3>{products[2]?.name || 'Precision Wrench Set'}</h3>
                                <p>{products[2]?.category || 'Hand Tools'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products by Category */}
            <section id="products" className="products-by-category">
                {categories.map(category => {
                    const categoryProducts = products.filter(p => p.category === category.id).slice(0, 5);
                    if (categoryProducts.length === 0) return null;

                    return (
                        <div key={category.id} className="category-section">
                            <div className="container">
                                <div className="category-header">
                                    <div>
                                        <h2>{category.name}</h2>
                                        <p>Explore our {category.name.toLowerCase()} collection</p>
                                    </div>
                                </div>

                                <div className="products-carousel">
                                    <button
                                        className="carousel-arrow carousel-arrow-left"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const scroll = e.currentTarget.parentElement.querySelector('.products-scroll');
                                            scroll.scrollBy({ left: -320, behavior: 'smooth' });
                                        }}
                                        aria-label="Previous products"
                                    >
                                    </button>

                                    <div className="products-scroll" id={`scroll-${category.id}`}>
                                        {categoryProducts.map(product => (
                                            <div key={product.id} className="product-card-wrapper">
                                                <ProductCard product={product} />
                                            </div>
                                        ))}

                                        <div className="product-card-wrapper">
                                            <Link to={`/category/${category.id}`} className="view-all-card">
                                                <div className="view-all-content">
                                                    <h3>View All</h3>
                                                    <p>Explore our complete {category.name.toLowerCase()} collection</p>
                                                    <div className="view-all-arrow">→</div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>

                                    <button
                                        className="carousel-arrow carousel-arrow-right"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const scroll = e.currentTarget.parentElement.querySelector('.products-scroll');
                                            scroll.scrollBy({ left: 320, behavior: 'smooth' });
                                        }}
                                        aria-label="Next products"
                                    >
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Quote Section */}
            <section className="quote-section">
                <div className="container">
                    <div className="quote-content">
                        <div className="quote-mark">"</div>
                        <h2>PRECISION IS NOT AN ACT,<br />IT'S A HABIT</h2>
                        <p>Every tool we craft is a testament to decades of engineering excellence and unwavering commitment to quality.</p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact-section">
                <div className="container contact-container">
                    <div className="contact-info">
                        <h2>GET IN TOUCH</h2>
                        <p className="contact-intro">We're here to help with your industrial tool needs</p>
                        <div className="info-items">
                            <div className="info-item">
                                <MapPin size={24} />
                                <div>
                                    <h3>ADDRESS</h3>
                                    <p>123 Industrial Avenue<br />Manufacturing District<br />New York, NY 10001</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <Phone size={24} />
                                <div>
                                    <h3>PHONE</h3>
                                    <p>+1 (555) 123-4567<br />Mon-Fri: 8AM - 6PM</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <Mail size={24} />
                                <div>
                                    <h3>EMAIL</h3>
                                    <p>info@ashukri.com<br />support@ashukri.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-wrapper">
                        <h2>SEND US A MESSAGE</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="Subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <textarea
                                    name="message"
                                    placeholder="Your Message"
                                    rows="6"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                <Send size={18} style={{ marginRight: '8px' }} />
                                SEND MESSAGE
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
