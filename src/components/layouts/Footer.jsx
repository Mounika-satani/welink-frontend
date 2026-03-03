import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                        <div className="logo-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="white" />
                            </svg>
                        </div>
                        <span className="footer-logo-text">AI Startup <span className="highlight">Discovery</span></span>
                    </Link>
                    <p className="footer-description">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae sit donec lectus suscipit ut.
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-link" aria-label="Facebook">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                        </a>
                        <a href="#" className="social-link" aria-label="Twitter">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                        </a>
                        <a href="#" className="social-link" aria-label="LinkedIn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                        </a>
                        <a href="#" className="social-link" aria-label="Instagram">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                        </a>
                    </div>
                </div>

                {/* Links Sections */}
                <div className="footer-column">
                    <h3 className="footer-heading">Platform</h3>
                    <Link to="/discover" className="footer-link">Discover startups</Link>
                    <Link to="/submit" className="footer-link">Submit your startup</Link>
                    <Link to="/trending" className="footer-link">Trending the week</Link>
                    <Link to="/about" className="footer-link">About</Link>
                </div>
                <div className="footer-column">
                    <h3 className="footer-heading">Company</h3>
                    <Link to="/about" className="footer-link">About Us</Link>
                    <Link to="/contact" className="footer-link">Contact</Link>
                    <Link to="/careers" className="footer-link">Careers</Link>
                </div>
                <div className="footer-column">
                    <h3 className="footer-heading">Legal</h3>
                    <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                    <Link to="/terms" className="footer-link">Terms of service</Link>
                    <Link to="/cookies" className="footer-link">Cookie policy</Link>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 AI Startup Discovery. All right reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
