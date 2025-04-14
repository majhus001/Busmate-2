import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isNavbarOpaque, setIsNavbarOpaque] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const downloadApp = () => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = 'https://expo.dev/accounts/majid10/projects/client/builds/a03e2eda-8ffc-4376-88e4-40f48abe4fe6';
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarOpaque(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header>
      <nav className={`navbar ${isNavbarOpaque ? 'opaque' : ''}`}>
        <div className="logo">
          <span className="logo-text">BUSMATE</span>
          <svg className="logo-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><a href="#" className="nav-item">Home</a></li>
          <li><a href="#about" className="nav-item">About</a></li>
          <li><a href="#services" className="nav-item">Services</a></li>
          <li><a href="#qna" className="nav-item">Q&A</a></li>
          <li>
            <button onClick={downloadApp} className="download-btn">Download App</button>
          </li>
        </ul>

        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <span className={isMobileMenuOpen ? 'open' : ''}></span>
          <span className={isMobileMenuOpen ? 'open' : ''}></span>
          <span className={isMobileMenuOpen ? 'open' : ''}></span>
        </button>
      </nav>
    </header>
  );
};

export default Navbar;