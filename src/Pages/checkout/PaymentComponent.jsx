import React, { useEffect, useState } from "react";
import Razorpay from "razorpay";
import axios from "axios";

const RAZOR_KEY_ID = import.meta.env.VITE_RAZOR_KEY_ID;
const apiUrl = import.meta.env.VITE_API_URL;

const PaymentComponent = () => {
  const [razororderid, setRazororderid] = useState('');
  const authToken = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const createOrder = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/create-order`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });
        const order = response.data;
        setRazororderid(order.id); // Store the order ID
      } catch (error) {
        console.error(error);
      }
    };

    createOrder();
  }, []);

  const handlePayment = () => {
    const options = {
      key: RAZOR_KEY_ID,
      amount: 50000, // Amount in paise
      currency: "INR",
      name: "Test Company",
      description: "Test Transaction",
      order_id: razororderid, // Use the stored order_id
      handler: (response) => {
        console.log(response);
        alert("Payment Successful!");
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.on('payment.failed', function (response){
      console.error(response.error);
      alert("Payment Failed: " + response.error.description);
    });
    razorpayInstance.open();
  };

  return (
    <div>
      <button onClick={handlePayment} disabled={!razororderid}>
        Pay Now
      </button>
    </div>
  );
};

export default PaymentComponent;