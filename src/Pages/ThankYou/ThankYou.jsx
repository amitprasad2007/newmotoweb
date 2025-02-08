import React from 'react';
import { Link } from 'react-router-dom';

export default function ThankYou() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Thank You for Your Order!</h1>
        <p className="text-gray-700 mb-6">
          Your order has been successfully placed. We appreciate your business and hope you enjoy your purchase.
        </p>
        <p className="text-gray-700 mb-6">
          You will receive an email confirmation shortly with the details of your order.
        </p>
        <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
} 