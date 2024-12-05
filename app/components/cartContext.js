// 'use client'
// import Cookies from 'js-cookie';
// import React, { createContext, useState, useContext, useEffect, useRef  } from 'react';

// // Context
// const CartItemContext = createContext();

// // Provider Component
// export const CartItemProvider = ({ children }) => {
//   const [cartGlobalItemData, setCartGlobalItemData] = useState(0);
//   const [pricesUpdated, setPricesUpdated] = useState(false);

//   // fetch quantity
//   const fetchGlobalCartData = async () => {
//     // const nonce = Cookies.get('nonce');
//     const cartToken = Cookies.get('cart-token');

//     const url = `${process.env.NEXT_PUBLIC_WOO_URL}/wc/store/cart`;
//         const credentials = {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             // 'Nonce': nonce,
//             'Cart-Token': cartToken ?? '',
//         },
//     };

//     try {
//       const response = await fetch(url, credentials);
//       const data = await response.json();
//       // console.log(data.items_count)
//       setCartGlobalItemData(data);
//     } catch (error) {
//       console.error('Error fetching items quantity:', error);
//     }
//   };

//   // Update quantity
//   const updateGlobalCartData = async () => {
//     await fetchGlobalCartData();
//   };

//   useEffect(() => {
//     fetchGlobalCartData();
//   }, []);

//   useEffect(() => {
//     if (cartGlobalItemData && !pricesUpdated) {
//       // console.log('cartGlobalItemData changed', cartGlobalItemData);
//       updateCartPrices();
//     }
//     // console.log('cartGlobalItemData changed2', cartGlobalItemData);
//   }, [cartGlobalItemData]);


//   const updateCartPrices = () => {
//     setCartGlobalItemData((prevData) => {
//       if (!prevData) return null;

//       // Perform deep copy to ensure immutability
//       const updatedData = { ...prevData };

//       let pricesChanged = false; // Flag to check if any price has changed

//       // Update prices in each item
//       updatedData.items = updatedData.items.map((item) => {
//         const rawPrices = item.prices;

//         const updatedPrice = parseFloat(rawPrices.price) / 100;  // Assuming prices are in cents
//         const updatedRegularPrice = parseFloat(rawPrices.regular_price) / 100;
//         const updatedSalePrice = parseFloat(rawPrices.sale_price) / 100;

//         // Check if prices are actually different
//         if (updatedPrice !== parseFloat(item.prices.price) ||
//             updatedRegularPrice !== parseFloat(item.prices.regular_price) ||
//             updatedSalePrice !== parseFloat(item.prices.sale_price)) {
//           pricesChanged = true;  // Mark that at least one price has changed
//         }

//         return {
//           ...item,
//           prices: {
//             ...item.prices,
//             price: updatedPrice.toFixed(2),  // Format price to 2 decimal places
//             regular_price: updatedRegularPrice.toFixed(2),
//             sale_price: updatedSalePrice.toFixed(2),
//           },
//         };
//       });

//       // Update totals to reflect the new prices if needed
//       const updatedTotals = {
//         ...updatedData.totals,
//         total_items: parseFloat(updatedData.totals.total_items) / 100,  // Adjust for cents
//         total_shipping: parseFloat(updatedData.totals.total_shipping) / 100,
//         total_price: parseFloat(updatedData.totals.total_price) / 100,
//       };

//       updatedData.totals = {
//         ...updatedTotals,
//         total_items: updatedTotals.total_items.toFixed(2),
//         total_shipping: updatedTotals.total_shipping.toFixed(2),
//         total_price: updatedTotals.total_price.toFixed(2),
//       };

//       // Only update if prices have changed
//       if (pricesChanged) {
//         setPricesUpdated(true);
//         return updatedData;
//       }

//       return prevData; // If no price change, return the previous data
//     });
//   };


//   return (
//     <CartItemContext.Provider value={{ cartGlobalItemData, updateGlobalCartData }}>
//       {children}
//     </CartItemContext.Provider>
//   );
// };

// // Custom Hook for easier usage
// export const useCartItem = () => useContext(CartItemContext);
