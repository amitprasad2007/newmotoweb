import React, { useEffect, useState } from "react";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";;
import axios from "axios";

const RAZOR_KEY_ID = import.meta.env.VITE_RAZOR_KEY_ID;
const apiUrl = import.meta.env.VITE_API_URL;

const PaymentComponent = (TOTALAMT,formData ,products) => {
  const [razororderid, setRazororderid] = useState('');
  const { error, isLoading, Razorpay } = useRazorpay();
  const handlePayment = async () => {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const cartdata = {'TOTALAMT': TOTALAMT.TOTALAMT,formData:formData,userId,products};

    const userData = { userId, cartdata };
    const response = await axios.post(`${apiUrl}/api/create-order`, cartdata, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    setRazororderid(response.data.orderIds.id);
    if (!response.data.orderIds.id) {
      console.error('Order ID not received');
      return; // Exit if order ID is not set
    }
    die;
    const options = {
      key: RAZOR_KEY_ID,
      amount: TOTALAMT.TOTALAMT, // Amount in paise
      currency: "INR",
      name: formData.formData.customername,
      description: "Product Price",
      order_id: response.data.orderIds.id, // Use the fetched order ID directly
      handler: async (response) => {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        const userData = { userId, response };
        const orderResponse = await axios.post(`${apiUrl}/api/paychecksave`, userData, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (orderResponse.status === 200) {
          console(orderResponse);
        } else {
          console.error('Failed to send cart data', orderResponse);
        }
      },
      prefill: {
        name: formData.formData.customername,
        email: formData.formData.email,
        contact: formData.formData.mobile,
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