
import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Search, Phone, Heart, User, Menu, X, ChevronDown, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../admin/services/mockDb';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [catOpen, setCatOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 4);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setCategories([
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
        ]);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) navigate(`/?search=${encodeURIComponent(search.trim())}`);
    };

    return (
        <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
            {/* ── Top Bar: Logo · Search · Icons ── */}
            <div className="header-top">
                <div className="container header-top-inner">
                    {/* Logo */}
                    <Link to="/" className="header-logo">
                        <div className="logo-icon">S</div>
                        <span className="logo-text">Suntric</span>
                    </Link>

                    {/* Search Bar */}
                    <form className="header-search" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button type="submit" className="search-btn" aria-label="Search">
                            <Search size={18} />
                        </button>
                    </form>

                    {/* Right Icons */}
                    <div className="header-icons">
                        <a href="tel:+971429577557" className="icon-item phone-item">
                            <Phone size={18} />
                            <div className="icon-text">
                                <span className="icon-label">Call Us</span>
                                <span className="icon-value">+971-4-295-7557</span>
                            </div>
                        </a>
                        <button className="icon-item" aria-label="Wishlist">
                            <Heart size={20} />
                            <span className="icon-label">Wishlist</span>
                        </button>
                        <button className="icon-item" aria-label="Account">
                            <User size={20} />
                            <span className="icon-label">Account</span>
                        </button>
                        <button className="icon-item cart-icon" aria-label="Cart">
                            <ShoppingCart size={20} />
                            <span className="icon-label">Cart</span>
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
                        onMouseLeave={() => setCatOpen(false)}
                    >
                        <Menu size={16} />
                        All Categories
                        <ChevronDown size={14} />
                        {catOpen && (
                            <div className="categories-dropdown">
                                {categories.map(cat => (
                                    <Link
                                        key={cat.id}
                                        to={`/category/${cat.id}`}
                                        className="dropdown-item"
                                        onClick={() => setCatOpen(false)}
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                                {categories.length === 0 && (
                                    <span className="dropdown-item">Loading...</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Category Links */}
                    <div className="nav-links-scroll">
                        {categories.slice(0, 7).map(cat => (
                            <Link key={cat.id} to={`/category/${cat.id}`} className="nav-cat-link">
                                {cat.name}
                            </Link>
                        ))}
                        <Link to="/" className="nav-cat-link nav-special">Bestsellers</Link>
                        <Link to="/" className="nav-cat-link nav-special highlight">Today's Deals</Link>
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
