'use client';
import { useDispatch } from 'react-redux';
import { loadCartFromWoo } from '../../store/slices/cartSlice';
import {fetchWooCommerceCart} from '../../api/fetchAndSyncCart';
 
const LoadCart = () => {
    const dispatch = useDispatch();

    fetchWooCommerceCart().then((data) => {
        if (data) {
            dispatch(loadCartFromWoo(data));
        }
    });

  return null; // No UI is needed
};

export default LoadCart;
