'use client';
import { useState, useRef, useEffect  } from "react";
import Image from "next/image";
// import Cookies from 'js-cookie';
import Link from "next/link";
import { useSelector, useDispatch } from 'react-redux';
import { cartDetails, addToCart, updateQty, loadCartFromWoo } from '../store/slices/cartSlice';
import { openModal } from "../store/slices/productDetailModalSlice";
import { fetchProductDetails } from '../api/fetchProductDetails';
import { fetchWooCommerceCart } from '../api/fetchAndSyncCart';
import { addToCartAPI } from '../api/addToCart';
import { removeItemFromCart } from '../api/removeItemFromCart';


export default function ProductCard({ product }){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // const cartItem = useSelector(cartDetails);

    const dispatch = useDispatch();
    const cartItem = useSelector((state) =>
        state.cart.items.find((item) => item.id === product.id)
    );

    const isAdded = Boolean(cartItem);

    // Add to Cart
    const handleAddToCart = async (quantity = 1) => {
        
        setLoading(true);

        // If Variable Product
        if(product.type === "variable"){
            const productDetails = await fetchProductDetails(product.id);
            if (productDetails) {
                dispatch(openModal(productDetails));
            }
        }
        
        try {
            const res = await addToCartAPI(product.id, quantity );
            dispatch(addToCart(product));
            dispatch(loadCartFromWoo(res));
        } catch (err) {
            setError("Failed to add product to cart.");
        } finally {
            setLoading(false);
        }
    };
    
    // Qty Change
    const handleQtyChange = async (change) => {

        const newQty =  parseInt(cartItem.quantity + change, 10);
        const itemKey = cartItem.key;

        setLoading(true);

        // return;

        // If Variable Product
        if(product.type === "variable"){
            const productDetails = await fetchProductDetails(product.id);
            if (productDetails) {
                dispatch(openModal(productDetails));
            }
        }

        // If Qty is 0
        if(newQty === 0){
            
            try {
                await removeItemFromCart(itemKey);
                
                await fetchWooCommerceCart().then((data) => {
                    if (data) {
                        dispatch(loadCartFromWoo(data));
                    }
                });
            } catch (err) {
                setError("Failed to remove item.");
            } finally {
                setLoading(false);
            }
            
        }else{
            try {
                const res = await addToCartAPI(product.id, newQty, true, itemKey );
                dispatch(loadCartFromWoo(res));
            } catch (err) {
                setError("Failed to update product's qty.");
            } finally {
                setLoading(false);
            }
        }
        

        // dispatch(updateQty({ id: product.id, qty: newQty }));
    };
    
    const productImage = product.images.length > 0 ? product.images[0].src : '/checkout/product.webp';

    
    return (
        <div className="productCard flex flex-col" key={`productID-${product.id}`}>
            <Link key={product.slug} href={product.slug} className="productImageWrapper overflow-hidden aspect-square inline-block">
                <Image className="productImage transition-all hover:scale-110 object-cover object-center h-full w-full" width={220} height={220} src={productImage} onError="imageOnError(event)" alt=""/>
            </Link>

            <div className="productCardInfo mt-4">
                <Link key={product.slug} href={product.slug} className="productCardTitle line-clamp-2 hover:text-[#EE741F] transition-all">
                    { product.name }
                </Link>
                
                <div className="productCardPricing flex justify-start items-center gap-2 mt-2 mb-4">
                    {product.price && 
                        <p className="discountedPrice font-semibold"> ₹{product.price} </p>
                    }
                    {product.on_sale && 
                        <del className="originalPrice text-sm text-black opacity-50">₹{product.regular_price}</del>
                    }
                    {product.on_sale &&
                        <p className="discount text-[#EE741F] text-sm font-medium">({(
                                ((product.regular_price - product.price) / product.regular_price) * 100
                            ).toFixed()}% OFF)
                        </p>
                    }
                </div>

                <div className="productCardATC flex justify-center">
                    {isAdded ? (
                        <div className="quantityControls flex items-center justify-center gap-2 border border-[#146EB4] rounded relative disabled:pointer-events-none disabled:opacity-50" disabled={loading}>
                            <button onClick={() => handleQtyChange(-1)} 
                                disabled={cartItem?.quantity <= 0 || loading}
                                className="quantityBtn text-[#146EB4] text-sm hover:bg-[#146EB41A] py-1 px-2 disabled:opacity-50">-</button>
                            <span className="quantity text-sm font-semibold">{cartItem.quantity}</span>
                            <button onClick={() => handleQtyChange(1)} 
                                disabled={
                                    product.stock_status != "instock" || loading || 
                                    (product.stock_quantity != null
                                      ? cartItem?.quantity >= product.stock_quantity
                                      : cartItem?.quantity >= 20)
                                }
                                
                                className="quantityBtn text-[#146EB4] text-sm hover:bg-[#146EB41A] py-1 px-2 disabled:opacity-50">+</button>

                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-[#146EB4] absolute" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ): ''}
                        </div>
                    ) : (
                        <button onClick={() => handleAddToCart(quantity)} disabled={loading || isAdded || product.stock_status != "instock"} 
                            className={`text-sm transition-all uppercase border bg-opacity-10 border-[#146EB4] hover:bg-[#146EB41A] text-[#146EB4] font-bold py-1 px-5 rounded flex items-center justify-center relative`}>
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-[#146EB4] absolute" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ): ''}
                            Add
                        </button>
                    )}
                </div>
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>
        </div>

        
    )
}