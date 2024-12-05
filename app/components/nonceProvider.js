// 'use client'
// import Cookies from 'js-cookie';
// import React, { createContext, useState, useContext, useEffect } from 'react';

// // Context
// const SaveNonceContext = createContext();

// // Provider Component
// export const NonceProvider = ({ children }) => {
//   const [nonce, setNonce] = useState(Cookies.get('nonce') || null);

//   // Fetch a new nonce from the API
//   const fetchNonce = async () => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_WOO_URL}/nexgi/wc/get-nonce`);
//       if (response.ok) {
//         const data = await response.json();
//         const fetchedNonce = data.data.Nonce;
        
//         setNonce(fetchedNonce);

//         Cookies.set('nonce', fetchedNonce, { expires: 1 });
//         console.log('Nonce fetched and saved in cookie:', fetchedNonce);
//       } else {
//         console.error('Failed to fetch nonce');
//         throw new Error('Failed to fetch nonce');
//       }
//     } catch (error) {
//       console.error('Error fetching nonce:', error);
//       throw error;
//     }
//   };

//   // Method to ensure nonce is available
//   const ensureNonce = async () => {
//     if (!nonce) {
//       console.log('Nonce is missing, fetching...');
//       // await fetchNonce();
//     }
//     return nonce;
//   };

//   // Initially check nonce
//   useEffect(() => {
//     ensureNonce();
//   }, []);

//   return (
//     <SaveNonceContext.Provider value={{ nonce, fetchNonce, ensureNonce }}>
//       {children}
//     </SaveNonceContext.Provider>
//   );
// };

// // Custom Hook for easier usage
// export const useNonceData = () => useContext(SaveNonceContext);
