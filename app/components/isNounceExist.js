// 'use client'
// import React, { useEffect } from 'react';
// import Cookies from 'js-cookie';

// export default function isNonceExist(){
//     useEffect(() => {
//         const checkAndSetNonce = async () => {
//             const nonce = Cookies.get('nonce');
        
//             // If nonce doesn't exist, save new one
//             if (!nonce) {
//                 try {
//                     // Fetch
//                     const response = await fetch(`${process.env.NEXT_PUBLIC_WOO_URL}/nexgi/wc/get-nonce`);
                    
//                     if (response.ok) {
//                         const data = await response.json();
//                         const fetchedNonce = data.data.Nonce;
        
//                         // Set the fetched nonce in the cookie
//                         Cookies.set('nonce', fetchedNonce, { expires: 1 });
//                         console.log('Nonce fetched and saved in cookie');
//                     } else {
//                         console.error('Failed to fetch nonce');
//                     }
//                 } catch (error) {
//                     console.error('Error fetching nonce:', error);
//                 }
//             } else {
//                 console.log('Nonce already exists in cookie');
//             }
//         };

//         checkAndSetNonce();
//     }, [])
// }
