import React, { useEffect, useState } from "react";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";;
import axios from "axios";

const RAZOR_KEY_ID = import.meta.env.VITE_RAZOR_KEY_ID;
const apiUrl = import.meta.env.VITE_API_URL;

const PaymentComponent = () => {
  const [razororderid, setRazororderid] = useState('');

  useEffect(() => {
    const createOrder = async () => {
      const authToken = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      const userData = {userId};
      try {
        const response = await axios.post(`${apiUrl}/api/create-order`, userData, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.status === 200) {
          setRazororderid(response.data.orderIds.id)
        } else {
          console.error('Failed to send cart data', response);
        }
      } catch (error) {
        console.error('Error sending cart data', error);
      }
    
    };

    createOrder();
  }, []);

  const { error, isLoading, Razorpay } = useRazorpay();
  const handlePayment = async () => {
    const options = {
      key: RAZOR_KEY_ID,
      amount: 50000, // Amount in paise
      currency: "INR",
      name: "Test Company",
      description: "Test Transaction",
      order_id: razororderid,
      handler: async (response) => {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        const userData = {userId,response};
        const orderResponse = await axios.post(`${apiUrl}/api/paychecksave`, userData, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (orderResponse.status === 200) {
          console(orderResponse)
        } else {
          console.error('Failed to send cart data', orderResponse);
        }
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

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <div>
      <button type='submit' className='bg-gray-900 mt-4 mb-8 px-6 py-3 rounded-md w-full font-medium text-white' onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
};

export default PaymentComponent;