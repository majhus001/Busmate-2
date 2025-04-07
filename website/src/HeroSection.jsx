import React, { useEffect, useRef } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const heroRef = useRef(null);
  
  useEffect(() => {
    // Add animation class after component mounts
    const hero = heroRef.current;
    if (hero) {
      hero.classList.add('loaded');
    }
    
    // Optional: Parallax effect on scroll
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-speed') || 0.2;
        element.style.transform = `translateY(${scrollPosition * speed}px)`;
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="premium-hero" ref={heroRef}>
      {/* Background elements */}
      <div className="bg-gradient"></div>
      <div className="bg-pattern"></div>
      
      <div className="premium-container">
        {/* Left side content */}
        <div className="hero-content-wrapper">
          <div className="content-section">
            <div className="badge">
              <span>Premium Transportation</span>
            </div>
            
            <h1 className="hero-heading">
              City Travel
              <span className="heading-highlight"> Reimagined</span>
            </h1>
            
            <p className="hero-subheading">
              Modern solutions for modern commuters. Reliable, comfortable, 
              and eco-friendly transportation across the city.
            </p>
            
            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">On-time arrival</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">City routes</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Customer support</span>
              </div>
            </div>
            
            <div className="testimonial">
              <div className="testimonial-content">
                <svg className="quote-icon" viewBox="0 0 24 24" width="24" height="24">
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" fill="currentColor"></path>
                </svg>
                <p>The most convenient transportation service I've ever used! Fast, reliable, and incredibly user-friendly.</p>
                <div className="testimonial-author">
                  <div className="author-image"></div>
                  <div className="author-info">
                    <span className="author-name">Sarah Johnson</span>
                    <span className="author-title">Daily Commuter</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="cta-buttons">
              <button className="cta-primary">
                <span className="btn-text">Download App</span>
                <span className="btn-icon">↓</span>
              </button>
              <button className="cta-secondary">
                <span className="btn-text">Learn More</span>
                <span className="btn-icon">→</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Right side animation */}
        <div className="hero-visual-wrapper">
          <div className="animation-container">
            {/* City background */}
            <div className="city-background parallax" data-speed="0.1"></div>
            
            {/* Road with markings */}
            <div className="road">
              <div className="road-marking"></div>
            </div>
            
            {/* Bus animation */}
            <div className="bus-wrapper">
              <div className="bus">
                <div className="bus-body">
                  <div className="bus-roof"></div>
                  <div className="bus-window window-1"></div>
                  <div className="bus-window window-2"></div>
                  <div className="bus-window window-3"></div>
                  <div className="bus-window window-4"></div>
                  <div className="bus-door"></div>
                  <div className="bus-front">
                    <div className="bus-light left"></div>
                    <div className="bus-light right"></div>
                  </div>
                  <div className="bus-stripe"></div>
                </div>
                <div className="wheel front-wheel">
                  <div className="wheel-center"></div>
                </div>
                <div className="wheel back-wheel">
                  <div className="wheel-center"></div>
                </div>
                <div className="bus-shadow"></div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="decoration-circles">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
              <div className="circle circle-3"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional decorative elements */}
      <div className="corner-decoration top-left"></div>
      <div className="corner-decoration bottom-right"></div>
    </div>
  );
};

export default HeroSection;