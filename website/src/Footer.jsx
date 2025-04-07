import React from 'react';
import './Footer.css';
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"></link>

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="social-icons">
          <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
          <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#" aria-label="Google"><i className="fab fa-google"></i></a>
          <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
          <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
        </div>
      </div>

      <div className="footer-content">
        <div className="footer-section">
          <h4>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-car-front-fill" viewBox="0 0 16 16">
              <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"/>
            </svg>
            BUSMATE
          </h4>
          <p>Busmate is your smart travel companion for daily commuting. Track your bus, plan your ride, and make every trip smoother and safer.</p>
        </div>

        <div className="footer-section">
          <h4>DOWNLOAD APP</h4>
          <ul>
            <li><a href="#">Download Busmate (User App)</a></li>
            <li><a href="#">Download Busmate Admin, Conductor App</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>DEVELOPED BY</h4>
          <ul>
            <li>Thamilarasan GP</li>
            <li>Rahul R</li>
            <li>Majidhusian J</li>
            <li>Tharan A</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>CONTACT</h4>
          <p><i className="bi bi-house-door-fill"></i> Busmate, Inc.</p>
          <p><i className="bi bi-envelope-fill"></i> support@busmate.com</p>
          <p><i className="bi bi-telephone-fill"></i> +91 98765 43210</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Copyright <a href="http://busmate.com">busmate.com</a></p>
      </div>
    </footer>
  );
};

export default Footer;