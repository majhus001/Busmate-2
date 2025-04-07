import React, { useState } from 'react';
import './ServicesSection.css';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      icon: '🪑',
      title: 'Seat Availability & Booking',
      description: 'Reserve your seat in advance with our easy-to-use booking system. View real-time seat availability and select your preferred spot.',
    },
    {
      id: 2,
      icon: '📍',
      title: 'Live Tracking',
      description: 'Track your bus in real-time and get accurate ETAs. Never miss your ride with our precise location tracking and notifications.',
    },
    {
      id: 3,
      icon: '💳',
      title: 'Different Payment Methods',
      description: 'Pay your way with multiple payment options including credit cards, digital wallets, and mobile banking for a seamless experience.',
    },
    {
      id: 4,
      icon: '🎫',
      title: 'Centralized Ticketing Hub',
      description: 'Get your tickets from our self-service machines at centralized hubs around the city. Use a single ticket to transfer between any bus to reach your destination.',
    },
  ];

  // State to track which service is currently active (default to first service)
  const [activeService, setActiveService] = useState(services[0].id);

  // Get the currently active service object
  const currentService = services.find(service => service.id === activeService);

  return (
    <section className="services-section">
      <div className="services-container">
        <div className="services-header">
          <h2>Our Services</h2>
          <p>Discover how we make your journey comfortable and convenient</p>
        </div>
        
        <div className="services-content-wrapper">
          {/* Left sidebar with service list */}
          <div className="services-sidebar">
            <ul className="services-list">
              {services.map((service) => (
              <li 
              key={service.id} 
              className={`service-item ${activeService === service.id ? 'active' : ''}`}
              onClick={() => setActiveService(service.id)}
            >
            
                  <span className="service-item-icon">{service.icon}</span>
                  <span className="service-item-title">{service.title}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Right content area with service details */}
          <div className="service-details">
            <div className="service-details-inner">
              <div className="service-details-icon">{currentService.icon}</div>
              <h3 className="service-details-title">{currentService.title}</h3>
              <p className="service-details-description">{currentService.description}</p>
              <button className="service-btn">Learn More</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;