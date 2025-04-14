import React from 'react';
import './DownloadApp.css';

const DownloadApp = () => {
  const downloadUserApp = () => {
    const link = document.createElement('a');
    link.href = 'https://expo.dev/accounts/majid10/projects/client/builds/a03e2eda-8ffc-4376-88e4-40f48abe4fe6';
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAdminApp = () => {
    // Replace with your admin app download link when available
    const link = document.createElement('a');
    link.href = 'https://expo.dev/accounts/majid10/projects/admin/builds/your-admin-build-id';
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="download-app">
      <h2>Download App</h2>

      <div className="app-container">
        <div className="app-card">
          <img
            src="https://cdn-icons-png.flaticon.com/128/15692/15692801.png"
            alt="User App Icon"
            className="app-icon"
          />
          <h3>Busmate – User App</h3>
          <p>Book your bus tickets, track your ride, and enjoy a seamless travel experience with Busmate.</p>
          <button
            onClick={downloadUserApp}
            className="download-button"
          >
            Download App
          </button>
        </div>

        <div className="app-card">
          <img
            src="https://cdn-icons-png.flaticon.com/128/15692/15692801.png"
            alt="Admin & Conductor App Icon"
            className="app-icon"
          />
          <h3>Busmate – Admin & Conductor App</h3>
          <p>Manage schedules, passengers, and bus operations in real time using our Admin & Conductor App.</p>
          <button
            onClick={downloadAdminApp}
            className="download-button"
          >
            Download App
          </button>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;