"use client";
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import Cookies from 'js-cookie';
import Confetti from "./confetti";
// import { useRouter } from 'next/router';

import { useSelector, useDispatch } from "react-redux";
import { cartDetails, resetAfterOrderCreation } from '../store/slices/cartSlice';

const PaymentComponent = forwardRef((props, ref) => {
    // const router = useRouter();
    const dispatch = useDispatch();
    const cartData = useSelector(cartDetails);
    
    const cookieWCHash = Cookies.get('woocommerce_cart_hash');
    const cookieCartToken = Cookies.get('cart-token');

    const hasFetched = useRef(false);
    const [paymentMethodData, setPaymentMethodData] = useState([]);
    const [activePaymentMethod, setActivePaymentMethod] = useState('');
    const [placeORderError, setPlaceORderError] = useState('');
    const [ctaPreloader, setCtaPreloader] = useState(false);


    // Call Confetti
    const confettiRef = useRef();

    const fetchPaymentMode = async () => {
  
        const url = `${process.env.NEXT_PUBLIC_WOO_URL}/wc/v3/payment_gateways`;
        const credentials = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_CONSUMER_SECRET}`),
          }
        };
  
        try {
          const response = await fetch(url ,credentials);
          const data = await response.json();
          
          setPaymentMethodData(data);
          
          if (data.length > 0) {
            setActivePaymentMethod(data[0].id);
          }
        
        } catch (error) {
          console.error("Error fetching products:", error);
          setLoading(false);
        }
    };
  
    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchPaymentMode();
        }
    }, []);

    const updatePaymentMethod = (methodId) => {
        setActivePaymentMethod(methodId);
    };

    // Place Order
    const placeOrder = async (paymentMethod) => {

        setPlaceORderError('');

        if(!paymentMethod.length){
            setError("Payment method required.");
            return 
        }

        setCtaPreloader(true);

        const url = `${process.env.NEXT_PUBLIC_WOO_URL}/wc/store/v1/checkout`;
        const credentials = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cart-Token': cookieWCHash ?? cookieCartToken ?? '',
            },
            body: JSON.stringify({
                "billing_address": cartData.billing_address,
                "payment_method": paymentMethod,
            })
        };

        try {
            const response = await fetch(url ,credentials);
            const data = await response.json();
            
            // setLoading(false);
            if(!response.ok){
                setPlaceORderError(data.message);
                
                throw new Error("Failed to place an order!");
            }
            
            console.log('place order response', data);
            setCtaPreloader(false);
            
            confettiRef.current.triggerConfettiFromParent();

            // Reset Cart Token & Redux States
            dispatch(resetAfterOrderCreation());
            Cookies.remove('woocommerce_cart_hash');
            Cookies.remove('cart-token');

        } catch (error) {
            console.error("Error placing order:", error);
            setLoading(false);
        }
    }

    const confettiSuccess = () => {
        // console.log("Confetti animation complete!");
        window.setTimeout(()=>{
            // router.push('/thanks');
            window.location.href = '/thanks';
        }, 1500)
    };

    return (
        <div className="flex gap-6">
            <div className="flex flex-col max-w-[290px] w-full border-r border-[#e6e6e6]">
                {paymentMethodData &&
                    paymentMethodData
                        .filter((method) => method.enabled)
                        .map((method) => (
                            <button key={`paymentKey-${method.id}`} className={`text-left w-full py-3 pr-3 font-medium border-r-4 
                                ${method.id === activePaymentMethod ? 'border-[#146EB4] text-[#146EB4] bg-primary-gradient' : 'border-transparent'}`}
                                onClick={() => updatePaymentMethod(method.id)} >
                                {method.method_title}
                            </button>
                        ))
                }
            </div>

            {/* Payment Description */}
            <div className="flex flex-col max-w-[470px] w-full">
                {paymentMethodData &&
                    paymentMethodData
                        .filter((method) => method.enabled)
                        .map((method) => (
                            method.id === activePaymentMethod && (
                                <div key={`selectedPaymentKey-${method.id}`} className="paymentMethodDetails p-5 border border-[#e6e6e6] rounded-lg">
                                    <div className="paymentMethodDetailsContent flex flex-col pb-10">
                                        <h4 className="text-lg text-black font-medium mb-1">{method.method_title}</h4>
                                        {
                                            method.method_description && 
                                            <p className="text-sm text-[grey]">
                                                {method.method_description}
                                            </p>
                                        }
                                    </div>

                                    <button className="relative w-full transition-all bg-[#146EB4] hover:bg-[#177ccb] text-white text-base py-3 px-5 rounded-md disabled:opacity-50"
                                        disabled={ctaPreloader}
                                        onClick={() => { placeOrder(method.id)
                                            }}>

                                            {
                                                !ctaPreloader ? (
                                                    'Place order'
                                                ) : (
                                                    <div className="text-center flex items-center justify-center">
                                                        <span className="loader inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                    </div>
                                                )
                                            }
                                    </button>

                                    <Confetti ref={confettiRef} onSuccess={confettiSuccess}/>

                                    {
                                        placeORderError &&
                                        <span className="text-sm text-red-600 inline-block mt-2">
                                            { placeORderError }
                                        </span> 
                                    }
                                </div>
                            )
                        ))
                }
            </div>
        </div>
    );
});

PaymentComponent.displayName = 'Payment Component';
export default PaymentComponent;