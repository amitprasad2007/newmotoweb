import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import './checkout.css'
import axios from 'axios';
import { UserContext } from "../../UserContext.jsx";
import { CartContext } from "../../CartContext.jsx";

export default function checkout () {
  const { userStatus, loading } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const { cart } = useContext(CartContext);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    billingAddress: '',
    billingState: '',
    billingZip: '',
    mobile: ''
  });
  let isSubmitting = false;

  useEffect(() => {
    if (!loading) {
      if (!userStatus) {
        navigate("/");
      } else {
        sendCartData();
      }
    }
  }, [loading, userStatus, navigate]);

  const sendCartData = async () => {
    if (cart.length > 0) {
      const authToken = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      const cartData = {
        userId,
        cart: cart.map(item => ({ ...item, quantity: item.quantity })),
      };
      try {
        const response = await axios.post(`${apiUrl}/api/savecart`, cartData, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.status === 200) {
          setProducts(response.data.product);
        } else {
          console.error('Failed to send cart data', response);
        }
      } catch (error) {
        console.error('Error sending cart data', error);
      }
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    isSubmitting = true;
    console.log('Form submitted');
    try {    
      navigate('/success');
    } catch (error) {
      console.error('Payment failed', error);
    } finally {
      isSubmitting = false;
    }
  };

  const handleQuantityChange = async (productId, change) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) => {
        const newQuantity = (product.cartquantity || 0) + change;
        // Ensure quantity is updated correctly
        return product.id === productId ? { ...product, cartquantity: Math.max(newQuantity, 0) } : product;
      });

      updateCartAPI(updatedProducts);

      return updatedProducts;
    });
  };

  const updateCartAPI = async (updatedProducts) => {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (updatedProducts.length === 0) {
      console.warn('No products in the cart to update.');
      return;
    }

    const cartData = {
      userId,
      cart: updatedProducts.map(item => ({ ...item, cartquantity: item.cartquantity })), // Ensure quantity is included
    };

    try {
      const response = await axios.post(`${apiUrl}/api/updatecart`, cartData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.status === 200) {
        setProducts(response.data.product);
      } else {
        console.error('Failed to send cart data', response);
      }
    } catch (error) {
      console.error('Error updating cart data', error);
    }
  };

  const calculateSubtotal = () => {
    return products.reduce((total, product) => {
      return total + (product.price * (product.cartquantity || 1));
    }, 0);
  };

  const shippingCost = 8.00; // Define the shipping cost

  return (
    <div className='bg-white text-left checkout'>
      <div className='flex sm:flex-row flex-col items-center bg-white sm:px-10 py-4 border-b'>
        <div className='mt-4 sm:mt-0 sm:ml-auto py-2 text-xs sm:text-base'>
          <div className='relative'>
            <ul className='relative flex justify-between items-center space-x-2 sm:space-x-4 w-full'>
              <li className='flex items-center space-x-3 sm:space-x-4 px-3 text-left'>
                <a
                  className='flex justify-center items-center bg-emerald-200 rounded-full w-6 h-6 font-semibold text-emerald-700 text-xs'
                  href='#'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-4 h-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth='2'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </a>
                <span className='font-semibold text-gray-900'>Shop</span>
              </li>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-4 h-4 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 5l7 7-7 7'
                />
              </svg>
              <li className='flex items-center space-x-3 sm:space-x-4 px-3 text-left'>
                <a
                  className='flex justify-center items-center bg-gray-600 rounded-full ring ring-gray-600 ring-offset-2 w-6 h-6 font-semibold text-white text-xs'
                  href='#'
                >
                  2
                </a>
                <span className='font-semibold text-gray-900'>Shipping</span>
              </li>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-4 h-4 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 5l7 7-7 7'
                />
              </svg>
              <li className='flex items-center space-x-3 sm:space-x-4 px-3 text-left'>
                <a
                  className='flex justify-center items-center bg-gray-400 rounded-full w-6 h-6 font-semibold text-white text-xs'
                  href='#'
                >
                  3
                </a>
                <span className='font-semibold text-gray-500'>Payment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className='grid lg:grid-cols-2 sm:px-10'>
        <div className='px-4 pt-8'>
          <p className='font-medium text-xl'>Order Summary</p>
          <p className='text-gray-400'>
            Check your items. And select a suitable shipping method.
          </p>
          <div className='space-y-3 bg-white mt-8 px-2 sm:px-6 py-4 border rounded-lg'>
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className='flex sm:flex-row flex-col bg-white rounded-lg'>
                  <img
                    className='m-2 border rounded-md w-28 h-24 object-center object-cover'
                    src={
                      product.photoproduct?.[0]?.photo_path ||
                      '/placeholder-image.jpg'
                    }
                    alt={product.title || 'Product'}
                  />
                  <div className='flex flex-col px-4 py-4 w-full'>
                    <span className='font-semibold'>{product.title}</span>
                    <span className='float-right text-gray-400'>{product.brand}</span>
                    <p className='font-bold text-lg'>₹{product.price}</p>
                    <div className='flex items-center mt-2'>
                      <button onClick={() => handleQuantityChange(product.id, -1)}>-</button>
                      <input type='number' value={product.cartquantity || 1} readOnly className='mx-2 w-12 text-center' />
                      <button onClick={() => handleQuantityChange(product.id, 1)}>+</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-4'>
                <p className='text-gray-500'>Your cart is empty. Start adding items!</p>
                <a href="/" className='text-blue-500 hover:underline mt-2 inline-block'>
                  Continue Shopping
                </a>
              </div>
            )}
          </div>
        </div>
        <div className='bg-gray-50 mt-10 lg:mt-0 px-4 pt-8'>
          <p className='font-medium text-xl'>Payment Details</p>
          <p className='text-gray-400'>
            Complete your order by providing your payment details.
          </p>
          <form onSubmit={handleSubmit}>
            <label htmlFor='email' className='block mt-4 mb-2 font-medium text-sm'>
              Email
            </label>
            <div className='relative'>
              <input
                type='text'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className='focus:z-10 border-gray-200 shadow-sm px-4 py-3 pl-11 border focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-sm outline-none'
                placeholder='your.email@gmail.com'
              />
              <div className='inline-flex left-0 absolute inset-y-0 items-center px-3 pointer-events-none'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-4 h-4 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
                  />
                </svg>
              </div>
            </div>
            <label
              htmlFor='mobile'
              className='block mt-4 mb-2 font-medium text-sm'
            >
              Mobile
            </label>
            <div className='relative'>
              <input
                type='text'
                id='mobile'
                name='mobile'
                value={formData.mobile}
                onChange={handleInputChange}
                className='focus:z-10 border-gray-200 shadow-sm px-4 py-3 pl-11 border focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-sm outline-none'
                placeholder='Your mobile number'
              />
              <div className='inline-flex left-0 absolute inset-y-0 items-center px-3 pointer-events-none'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-4 h-4 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2zm5 18a1 1 0 100-2 1 1 0 000 2z'
                  />
                </svg>
              </div>
            </div>
            <label
              htmlFor='card-holder'
              className='block mt-4 mb-2 font-medium text-sm'
            >
              Full name (First and Last name)
            </label>
            <div className='relative'>
              <input
                type='text'
                id='card-holder'
                name='card-holder'
                value={formData.cardHolder}
                onChange={handleInputChange}
                className='focus:z-10 border-gray-200 shadow-sm px-4 py-3 pl-11 border focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-sm uppercase outline-none'
                placeholder='Your full name here'
              />
              <div className='inline-flex left-0 absolute inset-y-0 items-center px-3 pointer-events-none'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-4 h-4 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z'
                  />
                </svg>
              </div>
            </div>
           
            <label
              htmlFor='billing-address'
              className='block mt-4 mb-2 font-medium text-sm'
            >
              Billing Address
            </label>
            <div className='flex sm:flex-row flex-col'>
              <div className='relative flex-shrink-0 sm:w-7/12'>
                <input
                  type='text'
                  id='billing-address'
                  name='billing-address'
                  value={formData.billingAddress}
                  onChange={handleInputChange}
                  className='focus:z-10 border-gray-200 shadow-sm px-4 py-3 pl-11 border focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-sm outline-none'
                  placeholder='Street Address'
                />
                <div className='inline-flex left-0 absolute inset-y-0 items-center px-3 pointer-events-none'>
                  <img
                    className='w-4 h-4 object-contain'
                    src='https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg'
                    alt=''
                  />
                </div>
              </div>
              <select
                type='text'
                name='billing-state'
                value={formData.billingState}
                onChange={handleInputChange}
                className='focus:z-10 border-gray-200 shadow-sm px-4 py-3 border focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-sm outline-none'
              >
                <option value='State'>State</option>
              </select>
              <input
                type='text'
                name='billing-zip'
                value={formData.billingZip}
                onChange={handleInputChange}
                className='focus:z-10 flex-shrink-0 border-gray-200 shadow-sm px-4 py-3 border focus:border-blue-500 rounded-md focus:ring-blue-500 sm:w-1/6 text-sm outline-none'
                placeholder='ZIP'
              />
            </div>

            <div className='mt-6 py-2 border-t border-b'>
              <div className='flex justify-between items-center'>
                <p className='font-medium text-gray-900 text-sm'>Subtotal</p>
                <p className='font-semibold text-gray-900'>₹{calculateSubtotal().toFixed(2)}</p>
              </div>
              <div className='flex justify-between items-center'>
                <p className='font-medium text-gray-900 text-sm'>Shipping</p>
                <p className='font-semibold text-gray-900'>₹8.00</p>
              </div>
            </div>
            <div className='flex justify-between items-center mt-6'>
              <p className='font-medium text-gray-900 text-sm'>Total</p>
              <p className='font-semibold text-2xl text-gray-900'>₹{(calculateSubtotal() + shippingCost).toFixed(2)}</p>
            </div>
            <button type='submit' className='bg-gray-900 mt-4 mb-8 px-6 py-3 rounded-md w-full font-medium text-white'>
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
