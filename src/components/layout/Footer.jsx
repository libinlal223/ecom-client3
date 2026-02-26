
import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => (
    <footer className="site-footer">
        <div className="container footer-inner">
            {/* Brand */}
            <div className="footer-brand">
                <div className="footer-logo">
                    <div className="logo-icon">S</div>
                    <span>Suntric</span>
                </div>
                <p className="footer-tagline">Professional tools & hardware solutions for industry experts across the Middle East.</p>
                <div className="footer-socials">
                    <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
                    <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
                    <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
                    <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
                </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
                <h4>Quick Links</h4>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/">All Products</Link></li>
                    <li><Link to="/">Bestsellers</Link></li>
                    <li><Link to="/">Today's Deals</Link></li>
                    <li><Link to="/contact">Contact Us</Link></li>
                </ul>
            </div>

            {/* Support */}
            <div className="footer-col">
                <h4>Support</h4>
                <ul>
                    <li><a href="#">FAQ</a></li>
                    <li><a href="#">Shipping Policy</a></li>
                    <li><a href="#">Returns</a></li>
                    <li><a href="#">Track Order</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                </ul>
            </div>

            {/* Contact */}
            <div className="footer-col">
                <h4>Contact Us</h4>
                <ul className="contact-list">
                    <li><MapPin size={15} /><span>123 Industrial Ave, Dubai, UAE</span></li>
                    <li><Phone size={15} /><a href="tel:+97142957557">+971-4-295-7557</a></li>
                    <li><Mail size={15} /><a href="mailto:info@suntric.com">info@suntric.com</a></li>
                </ul>
            </div>
        </div>

        <div className="footer-bottom">
            <div className="container">
                <span>© {new Date().getFullYear()} Suntric. All rights reserved.</span>
                <button
                    className="back-top"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    ↑ Back to Top
                </button>
            </div>
        </div>
    </footer>
);

export default Footer;
