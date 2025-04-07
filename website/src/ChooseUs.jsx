import React from 'react';
import './ChooseUs.css';

const ChooseUs = () => {
  return (
    <section id="choose-us">
      <div className="choose-container">
        <div className="choose-text">
          <h2>Why Choose Us?</h2>
          <p>
            We offer a seamless, digital-first experience tailored for both safety and efficiency.
            Our bus system combines real-time tracking, flexible payment options, and user-friendly
            mobile apps to elevate daily travel. Trust us to deliver comfort, control, and
            convenience — all in one ride.
          </p>
          <ul className="choose-list">
            <li>Real-Time Bus Tracking</li>
            <li>Easy Seat Booking</li>
            <li>Multiple Payment Methods</li>
            <li>Secure & Transparent Processes</li>
            <li>Mobile App Support (User & Conductor)</li>
          </ul>
        </div>
        <div className="choose-image">
          <img src="https://cdna.artstation.com/p/assets/images/images/064/299/058/large/sathesh-tamilnadu-bus.jpg?1687586148" alt="Bus Illustration" />
        </div>
      </div>
    </section>
  );
};

export default ChooseUs;
