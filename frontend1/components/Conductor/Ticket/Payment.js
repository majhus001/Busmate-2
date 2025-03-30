import React, { useState } from "react";
import axios from "axios";

const Payment = ({ Total = 100 }) => {
  const [book, setBook] = useState({
    name: "user1",
    author: "John Green",
    img: "https://images-na.ssl-images-amazon.com/images/I/817tHNcyAgL.jpg",
    price: 250,
  });

  const KEY_ID = "rzp_test_CMsB4Ic9wCgo4O"; // Your Razorpay key

  const initPayment = (data) => {
    // Ensure Razorpay script is available
    if (!window.Razorpay) {
      console.error("Razorpay script not loaded");
      return;
    }

    const options = {
      key: KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: book.name,
      description: "Test Transaction",
      image: book.img,
      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyUrl = "http://localhost:3001/api/payment/verify";
          const { data } = await axios.post(verifyUrl, response);
          console.log(data); // Payment verified
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#3399cc", // Adjust theme color if needed
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open(); // This will open the Razorpay payment window
  };

  const handlePayment = async () => {
    try {
      const orderUrl = "http://localhost:3001/api/payment/orders";
      const { data } = await axios.post(orderUrl, { amount: Total + 5 });
      console.log(data); // Order created
      initPayment(data.order); // Open Razorpay payment window
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className="deliboxmain">
      <div className="delibox">
        {/* Delivery form */}
      </div>
      <div className="cartto">
        <h2 className="cartton"> Cart Total</h2>
        <div className="subtotal">
          <p>Subtotal</p>
          <p>${Total}</p>
        </div>
        <div className="deliveryfee">
          <p>Delivery Fee</p>
          <p>$5</p>
        </div>
        <div className="totaln">
          <p>Total</p>
          <p>${Total + 5}</p>
        </div>
        <button onClick={handlePayment} className="proceed">
          Proceed To Payment
        </button>
      </div>
    </div>
  );
};

export default Payment;