import React, { useEffect, useState } from 'react';
import './PaymentMethods.css';

const PaymentMethods = () => {
  const [initialHover, setInitialHover] = useState(false);

  useEffect(() => {
    const container1 = document.getElementById('containers1s'); // Fixed ID to match JSX
    setTimeout(() => {
      container1.classList.add('initial-state');
    }, 100); // Small delay for initial load
  }, []);

  const handleHover = () => {
    setInitialHover(true);
  };

  return (
    <section className="payment-methods">
      <div className="text-content">
        <div className="left-content">
          <h2>Smart Bus Ticketing System</h2>
          <p>Experience modern, efficient travel with digital payments, real-time tracking, and simplified ticketing options—right from your seat.</p>
          <button className="learn-more-btn">Learn More</button>
        </div>
      </div>

      <div className="container-wrapper">
        <div
          className={`containers ${!initialHover ? 'initials' : 'shrinkeds'}`}
          id="containers1s"
          onMouseEnter={handleHover}
        >
          <div className="contents">
            <p className="initial-texts">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-1-square" viewBox="0 0 16 16">
                <path d="M9.283 4.002V12H7.971V5.338h-.065L6.072 6.656V5.385l1.899-1.383z"/>
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
              </svg> <b>Online Payment</b>
            </p>
            <p className="hover-texts">Pay digitally via UPI or card inside bus.</p>
            <img className="initial-imgs" src="https://cdn-icons-png.flaticon.com/128/4108/4108843.png" alt="Online Payment" />
            <img className="hover-imgs" src="https://cdn-icons-png.flaticon.com/128/4108/4108843.png" alt="Online Payment Hover" />
          </div>
        </div>

        <div className="containers" id="container2">
          <div className="contents">
            <p className="initial-texts">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-2-square" viewBox="0 0 16 16">
                <path d="M6.646 6.24v.07H5.375v-.064c0-1.213.879-2.402 2.637-2.402 1.582 0 2.613.949 2.613 2.215 0 1.002-.6 1.667-1.287 2.43l-.096.107-1.974 2.22v.077h3.498V12H5.422v-.832l2.97-3.293c.434-.475.903-1.008.903-1.705 0-.744-.557-1.236-1.313-1.236-.843 0-1.336.615-1.336 1.306"/>
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
              </svg> <br/><b>QR Scan</b>
            </p>
            <p className="hover-texts">Scan QR code from conductor to pay instantly.</p>
            <img className="initial-imgs" src="https://cdn-icons-png.flaticon.com/128/9359/9359442.png" alt="QR Scan" />
            <img className="hover-imgs" src="https://cdn-icons-png.flaticon.com/128/9359/9359442.png" alt="QR Scan Hover" />
          </div>
        </div>

        <div className="containers" id="container3">
          <div className="contents">
            <p className="initial-texts">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-3-square" viewBox="0 0 16 16">
                <path d="M7.918 8.414h-.879V7.342h.838c.78 0 1.348-.522 1.342-1.237 0-.709-.563-1.195-1.348-1.195-.79 0-1.312.498-1.348 1.055H5.275c.036-1.137.95-2.115 2.625-2.121 1.594-.012 2.608.885 2.637 2.062.023 1.137-.885 1.776-1.482 1.875v.07c.703.07 1.71.64 1.734 1.917.024 1.459-1.277 2.396-2.93 2.396-1.705 0-2.707-.967-2.754-2.144H6.33c.059.597.68 1.06 1.541 1.066.973.006 1.6-.563 1.588-1.354-.006-.779-.621-1.318-1.541-1.318"/>
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
              </svg><b>Hub Ticket</b>
            </p>
            <p className="hover-texts">Purchase ticket directly at the bus station hub.</p>
            <img className="initial-imgs" src="https://cdn-icons-png.flaticon.com/128/2918/2918823.png" alt="Hub Ticket" />
            <img className="hover-imgs" src="https://cdn-icons-png.flaticon.com/128/2918/2918823.png" alt="Hub Ticket Hover" />
          </div>
        </div>

        <div className="containers" id="container4">
          <div className="contents">
            <p className="initial-texts">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-4-square" viewBox="0 0 16 16">
                <path d="M7.106 6.238v1.075H5.682V8.52h1.424v1.74h1.26v-1.74h.79V7.313h-.79v-2.19H7.106z"/>
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
              </svg><b>Cash Pay</b>
            </p>
            <p className="hover-texts">Hand over cash to the conductor onboard directly.</p>
            <img className="initial-imgs" src="https://cdn-icons-png.flaticon.com/128/2331/2331941.png" alt="Cash Payment" />
            <img className="hover-imgs" src="https://cdn-icons-png.flaticon.com/128/2331/2331941.png" alt="Cash Payment Hover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentMethods;