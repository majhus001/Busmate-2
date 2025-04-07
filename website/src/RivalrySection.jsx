import React from 'react';
import './RivalrySection.css';

const RivalrySection = () => {
  const comparisonFeatures = [
    {
      id: 1,
      feature: "📍 Real-time Tracking",
      yourApp: { has: true, description: "Live GPS tracking with accurate ETAs and notifications" },
      competitors: { has: false, description: "Scheduled times only, no real-time updates" },
    },
    {
      id: 2,
      feature: "🎫 Universal Ticketing",
      yourApp: { has: true, description: "One ticket for any bus route with unlimited transfers" },
      competitors: { has: false, description: "Route-specific tickets with paid transfers" },
    },
    {
      id: 3,
      feature: "💺 Seat Selection",
      yourApp: { has: true, description: "Choose your preferred seat in advance" },
      competitors: { has: false, description: "First come, first served seating only" },
    },
    {
      id: 4,
      feature: "💳 Payment Options",
      yourApp: { has: true, description: "Credit cards, digital wallets, mobile banking, cash" },
      competitors: { has: true, description: "Credit cards and cash only" },
    },
    {
      id: 5,
      feature: "🏧 Self-service Kiosks",
      yourApp: { has: true, description: "Centralized ticketing hubs throughout the city" },
      competitors: { has: false, description: "In-bus purchasing only" },
    },
  ];

  return (
    <section className="rivalry-component">
      <div className="rivalry-container">
        <h2>Our Service vs Competitors</h2>

        <div className="comparison-section">
          <div className="our-features">
            <div className="cartoon-man left">
              <img src="https://cdn-icons-png.flaticon.com/256/11088/11088018.png" alt="Cartoon Man Left" />
            </div>
            <h4>Our Features</h4>
            <ul>
              {comparisonFeatures.map((item) => (
                <li key={item.id}>
                  <span className="feature-name">{item.feature}</span>
                  {item.yourApp.description}
                </li>
              ))}
            </ul>
          </div>

          <div className="thunder-divider">
            <div className="vs-text">VS</div>
            <div className="thunder-shape"></div>
          </div>

          <div className="competitor-features">
            <div className="cartoon-man right">
              <img src="https://cdn-icons-png.flaticon.com/128/11088/11088014.png" alt="Cartoon Man Right" />
            </div>
            <h4>Competitor Features</h4>
            <ul>
              {comparisonFeatures.map((item) => (
                <li key={item.id}>
                  <span className="feature-name">{item.feature}</span>
                  {item.competitors.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RivalrySection;