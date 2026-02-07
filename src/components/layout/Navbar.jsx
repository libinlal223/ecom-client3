
import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-content">
                <Link to="/" className="navbar-logo">
                    <span>ATELIER</span>
                </Link>

                <div className="navbar-desktop">
                    <Link to="/" className="nav-link">Home</Link>
                    <a href="#about" className="nav-link">About</a>
                    <a href="#products" className="nav-link">Products</a>
                    <a href="#contact" className="nav-link">Contact</a>
                </div>

                <div className="navbar-actions">
                    <a href="#" className="nav-cta">Contact Us</a>
                    <button className="icon-btn mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="mobile-menu">
                    <Link to="/" className="mobile-link" onClick={() => setIsOpen(false)}>Home</Link>
                    <a href="#about" className="mobile-link" onClick={() => setIsOpen(false)}>About</a>
                    <a href="#products" className="mobile-link" onClick={() => setIsOpen(false)}>Products</a>
                    <a href="#contact" className="mobile-link" onClick={() => setIsOpen(false)}>Contact</a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
