import React from 'react';
import './DownloadApp.css';

const DownloadApp = () => {
  return (
    <section className="download-app">
      <h2>Download App</h2>

      <div className="app-container">
        <div className="app-card">
          <img
            src="https://cdn-icons-png.flaticon.com/128/15692/15692801.png" // Replace with your User App icon
            alt="User App Icon"
            className="app-icon"
          />
          <h3>Busmate – User App</h3>
          <p>Book your bus tickets, track your ride, and enjoy a seamless travel experience with Busmate.</p>
          <a
            href="#"
            className="download-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download App
          </a>
        </div>

        <div className="app-card">
          <img
            src="https://cdn-icons-png.flaticon.com/128/15692/15692801.png" // Replace with your Admin/Conductor App icon
            alt="Admin & Conductor App Icon"
            className="app-icon"
          />
          <h3>Busmate – Admin & Conductor App</h3>
          <p>Manage schedules, passengers, and bus operations in real time using our Admin & Conductor App.</p>
          <a
            href="#"
            className="download-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download App
          </a>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;