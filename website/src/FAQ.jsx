import React, { useState } from 'react';
import './FAQ.css';
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"></link>
const faqData = {
  General: [
    {
      question: "Can I track the location of my booked bus online?",
      answer: "Yes, you can! Simply click on 'Track My Bus' from your bookings to view real-time location and updates, ensuring you're always informed about your bus's movement."
    },
    {
      question: "Why book bus tickets online?",
      answer: "Online booking offers convenience, secure payment, 24/7 availability, and instant ticket access. Skip the queues and plan your journey effortlessly!"
    },
    {
      question: "How do I cancel or reschedule my booking?",
      answer: "Go to 'My Bookings' in the app or website, select your ticket, and choose 'Cancel' or 'Reschedule.' Policies may vary by operator, so check the terms."
    }
  ],
  Payment: [
    {
      question: "What payment methods are accepted?",
      answer: "We accept UPI, credit/debit cards, net banking, mobile wallets, and more. All transactions are encrypted with top-tier security protocols."
    },
    {
      question: "Is it safe to pay online?",
      answer: "Absolutely! Our payment gateway uses SSL encryption and complies with PCI-DSS standards to ensure your data is secure."
    },
    {
      question: "Can I get a refund for a cancelled ticket?",
      answer: "Yes, refunds depend on the operator’s cancellation policy. Processed amounts are credited back to your original payment method within 5-7 business days."
    }
  ],
  "Travel Guidelines": [
    {
      question: "Are masks mandatory during travel?",
      answer: "While not universally mandatory, we recommend wearing a mask for your safety and comfort, especially on crowded or long-distance routes."
    },
    {
      question: "What if my bus gets delayed?",
      answer: "You’ll receive real-time updates via SMS or app notifications. Use the live tracking feature to monitor your bus’s status."
    },
    {
      question: "What should I carry for a smooth journey?",
      answer: "Bring a valid ID, your e-ticket (digital or printed), and any personal essentials like water or snacks. Check operator-specific requirements in advance."
    },
    {
      question: "Can I bring extra luggage?",
      answer: "Most buses allow standard luggage, but extra or oversized items may incur a fee. Contact the operator or check your booking details for specifics."
    }
  ]
};

const FAQ = () => {
  const [activeTab, setActiveTab] = useState('General');
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <p className="faq-subtitle">Find answers to common queries about booking, payments, and travel.</p>

      <div className="tabs">
        {Object.keys(faqData).map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => {
              setActiveTab(tab);
              setActiveIndex(null); // Reset accordion when switching tabs
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="faq-list">
        {faqData[activeTab].map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? 'open' : ''}`}
            onClick={() => toggleAccordion(index)}
          >
            <div className="faq-question">
              <span>{faq.question}</span>
              <span className="toggle-icon">{activeIndex === index ? '−' : '+'}</span>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;