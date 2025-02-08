import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderStatus, setOrderStatus] = useState(null);

  const placeOrder = async (orderData) => {
    console.log('Placing order:', orderData); // Debugging log
    const apiUrl = import.meta.env.VITE_API_URL;
    const authToken = localStorage.getItem('authToken');

    try {
      const response = await axios.post(`${apiUrl}/api/placeorder`, orderData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.status === 200) {
        setOrderStatus('Order placed successfully');
        return response.data;
      } else {
        setOrderStatus('Failed to place order');
        console.error('Failed to place order', response);
      }
    } catch (error) {
      setOrderStatus('Error placing order');
      console.error('Error placing order', error);
    }
  };

  return (
    <OrderContext.Provider value={{ orderStatus, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  //console.log('useOrder context:', context); // Debugging log
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
