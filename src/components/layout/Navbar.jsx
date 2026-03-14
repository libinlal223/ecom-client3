
import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Search, Phone, Heart, User, Menu, X, ChevronDown, ChevronRight, ShoppingCart, LayoutGrid } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [catOpen, setCatOpen] = useState(false);
    const [hoveredCat, setHoveredCat] = useState(null);
    const [subPanelPos, setSubPanelPos] = useState({ top: 0, left: 0 });
    const [hoveredTopCat, setHoveredTopCat] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 4);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [liveCategories, liveSubcats] = await Promise.all([
                    productService.getCategories(),
                    productService.getSubcategories()
                ]);
                setCategories(liveCategories || []);
                setSubcategories(liveSubcats || []);
            } catch (error) {
                console.error("Failed to load categories for navbar:", error);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/search?q=${encodeURIComponent(search.trim())}`);
        }
    };

    return (
        <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
            {/* ── Top Notice Bar ── */}
            <div className="header-notice-bar">
                <div className="container notice-bar-inner">
                    <div className="notice-left">
                        Call Us: +971 4 295 7557
                    </div>
                    <div className="notice-right">
                        <div className="notice-item highlight-box">Inquiry : info@starlinks.com</div>
                        <Link to="/admin/login" className="notice-action-btn">
                            <User size={16} /> Login
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Main Header: Logo · Search · Icons ── */}
            <div className="header-main">
                <div className="container header-main-inner">
                    {/* Logo */}
                    <Link to="/" className="header-logo">
                        <div className="logo-icon">S</div>
                        <span className="logo-text">Star Links</span>
                    </Link>

                    {/* Search Bar */}
                    <div className="header-search-container">
                        <form className="header-search" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search product"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <button type="submit" className="search-btn" aria-label="Search">
                                <Search size={18} />
                            </button>
                        </form>
                    </div>

                    {/* Right Icons */}
                    <div className="header-icons">
                        <a href="tel:+971429577557" className="header-action-item call-action">
                            <Phone size={20} className="action-icon" />
                            <div className="action-text">
                                <span className="action-label">Call Us</span>
                                <span className="action-value">+971 4 295 7557</span>
                            </div>
                        </a>

                        <button className="header-action-item" aria-label="Wishlist">
                            <div className="icon-with-badge">
                                <Heart size={20} className="action-icon" />
                                <span className="badge">0</span>
                            </div>
                            <span className="action-label">Wishlist</span>
                        </button>

                        <button className="header-action-item" aria-label="Cart">
                            <div className="icon-with-badge">
                                <ShoppingCart size={22} className="action-icon" />
                                <span className="badge">0</span>
                            </div>
                        </button>

                        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
                            {isOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Bottom Bar: Category Nav ── */}
            <nav className="header-nav">
                <div className="container header-nav-inner">
                    {/* All Categories Dropdown */}
                    <div
                        className={`all-categories-btn ${catOpen ? 'open' : ''}`}
                        onMouseEnter={() => setCatOpen(true)}
                        onMouseLeave={() => { setCatOpen(false); setHoveredCat(null); }}
                    >
                        <LayoutGrid size={16} />
                        Browse All Categories
                        {catOpen && (
                            <div className="categories-dropdown">
                                {categories.map(cat => {
                                    const catSubs = subcategories.filter(sub => (sub.category_id || sub.category) === cat.id);
                                    const hasSubs = catSubs.length > 0;

                                    return (
                                        <div
                                            key={cat.id}
                                            className="dropdown-item-wrapper"
                                            onMouseEnter={e => {
                                                setHoveredCat(cat.id);
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setSubPanelPos({ top: rect.top, left: rect.right });
                                            }}
                                            onMouseLeave={() => setHoveredCat(null)}
                                        >
                                            <Link
                                                to={`/category/${cat.id}`}
                                                className="dropdown-item d-flex-between"
                                                onClick={() => { setCatOpen(false); setHoveredCat(null); }}
                                            >
                                                <span>{cat.name}</span>
                                                {hasSubs && <ChevronRight size={14} className="sub-chevron" />}
                                            </Link>

                                            {hoveredCat === cat.id && hasSubs && (
                                                <div
                                                    className="subcategories-panel"
                                                    style={{ position: 'fixed', top: subPanelPos.top, left: subPanelPos.left + 4 }}
                                                >
                                                    {catSubs.map(sub => (
                                                        <Link
                                                            key={sub.id}
                                                            to={`/category/${cat.id}?sub=${sub.id}`}
                                                            className="sub-dropdown-item"
                                                            onClick={() => { setCatOpen(false); setHoveredCat(null); }}
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {categories.length === 0 && (
                                    <span className="dropdown-item">Loading...</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Fixed Nav Links with Mega Menu */}
                    <div className="nav-links-scroll">
                        {[
                            { label: 'Home',               to: '/' },
                            { label: 'Safety',             to: '/search?q=safety' },
                            { label: 'Building Materials', to: '/search?q=building+materials' },
                            { label: 'Tools',              to: '/search?q=tools' },
                            { label: 'PPE',                to: '/search?q=ppe' },
                            { label: 'Lifting',            to: '/search?q=lifting' },
                            { label: 'HDPE',               to: '/search?q=hdpe' },
                        ].map(({ label, to }) => (
                            <div
                                key={label}
                                className="nav-mega-wrapper"
                                onMouseEnter={() => setHoveredTopCat(label)}
                                onMouseLeave={() => setHoveredTopCat(null)}
                            >
                                <Link to={to} className="nav-cat-link">
                                    {label} <ChevronDown size={13} className="nav-chevron" />
                                </Link>

                                {hoveredTopCat === label && categories.length > 0 && (
                                    <div className="mega-menu-panel">
                                        <div className="mega-menu-grid">
                                            {categories.slice(0, 8).map(cat => {
                                                const catSubs = subcategories.filter(s => (s.category_id || s.category) === cat.id);
                                                return (
                                                    <div key={cat.id} className="mega-menu-col">
                                                        <Link
                                                            to={`/category/${cat.id}`}
                                                            className="mega-cat-heading"
                                                            onClick={() => setHoveredTopCat(null)}
                                                        >
                                                            {cat.name}
                                                        </Link>
                                                        {catSubs.map(sub => (
                                                            <Link
                                                                key={sub.id}
                                                                to={`/category/${cat.id}?sub=${sub.id}`}
                                                                className="mega-sub-link"
                                                                onClick={() => setHoveredTopCat(null)}
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </nav>

            {/* ── Mobile Drawer ── */}
            {isOpen && (
                <div className="mobile-drawer">
                    <form className="mobile-search" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button type="submit"><Search size={16} /></button>
                    </form>
                    <Link to="/" className="mobile-link" onClick={() => setIsOpen(false)}>Home</Link>
                    {categories.map(cat => (
                        <Link key={cat.id} to={`/category/${cat.id}`} className="mobile-link" onClick={() => setIsOpen(false)}>
                            {cat.name}
                        </Link>
                    ))}
                    <Link to="/contact" className="mobile-link" onClick={() => setIsOpen(false)}>Contact</Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;
