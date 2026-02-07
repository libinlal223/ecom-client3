
import React, { useState } from 'react';
import './Contact.css';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

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
        <div className="contact-page">
            <div className="contact-hero">
                <div className="container">
                    <h1>GET IN TOUCH</h1>
                    <p>We're here to help with your industrial tool needs</p>
                </div>
            </div>

            <div className="container contact-container">
                <div className="contact-info">
                    <h2>CONTACT INFORMATION</h2>
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
        </div>
    );
};

export default Contact;
