"use client";
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import Cookies from 'js-cookie';
import Confetti from "./confetti";

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { cartDetails, selectCartItems, toggleChangesPreloader, loadCartFromWoo } from '../store/slices/cartSlice';

const CouponsModule = forwardRef((props, ref) => {
    const dispatch = useDispatch();

    const cartData = useSelector(cartDetails);
    const cookieCartToken = Cookies.get('cart-token');
    const hasFetched = useRef(false);
    const confettiRef = useRef();
    const [couponsData, setCouponsData] = useState([]);
    const [couponCode, setCouponCode] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState('');
    const [couponApplyPreloader, setCouponApplyPreloader] = useState(false);
    const [couponErrors, setCouponErrors] = useState({});
    const [applyPreloader, setApplyPreloader] = useState(false);
    const [removePreloader, setRemovePreloader] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Toggle function to show or hide the collapsable content
    const toggleCollapse = () => {
        setIsDetailsOpen((prevState) => !prevState); // Toggle the state
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    const fetchCoupons = async () => {
        // Ensure nonce is available
        // nonce = await ensureNonce();
        
        const url = `${process.env.NEXT_PUBLIC_WOO_URL}/wc/v3/coupons`;
        const credentials = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                // 'Nonce': nonce,
                'Authorization': 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_CONSUMER_SECRET}`),
            },
        };
  
        try {   
            const response = await fetch(url ,credentials);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error("Failed to get the coupons!");
            }

            const data = await response.json();
            setCouponsData(data);
  
        } catch (error) {
          console.error("Error fetching coupons:", error);
        }
    };

    // Apply Coupon
    const applyCoupon = async (code) => {    
        const url = `${process.env.NEXT_PUBLIC_WOO_URL}/wc/store/v1/cart/apply-coupon`;
        const credentials = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Cart-Token": cookieCartToken,
            },
            body: JSON.stringify({
                "code": code,
            }),
        };

        setCouponApplyPreloader((prev) => ({ ...prev, [code]: true }));
        dispatch(toggleChangesPreloader(true));
        try {   
            const response = await fetch(url ,credentials);

            if (!response.ok) {
                const errorData = await response.json();

                setCouponErrors((prevErrors) => ({
                    ...prevErrors,
                    [code]: errorData.message,
                }));

                return errorData;
                throw new Error("Failed to apply the coupon!");
            }
            
            const data = await response.json();
            dispatch(loadCartFromWoo(data));
            confettiRef.current.triggerConfettiFromParent();

            setCouponErrors((prevErrors) => {
                const updatedErrors = { ...prevErrors };
                delete updatedErrors[code];
                return updatedErrors;
            });
  
        } catch (error) {
          console.error("Error while applying the coupon:", error);
        } finally{
            dispatch(toggleChangesPreloader(false));
            setApplyPreloader(false);
            setCouponApplyPreloader((prev) => {
                const updatedPreloader = { ...prev };
                delete updatedPreloader[code];
                return updatedPreloader;
            });
        }
    };

    const handleSubmitCoupon = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        setApplyPreloader(true);
        setInputErrorMessage('');

        const result = await applyCoupon(couponCode);

        if (result !== undefined && result !== null) {
            if (result?.data?.status !== 200) {
                setInputErrorMessage(result?.message);
            }
        } else {
            setCouponCode('');
        }
    }

    const removeCoupon = async (code) => {    
        const url = `${process.env.NEXT_PUBLIC_WOO_URL}/wc/store/v1/cart/remove-coupon`;
        const credentials = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Cart-Token": cookieCartToken,
            },
            body: JSON.stringify({
                "code": code,
            }),
        };

        setCouponApplyPreloader((prev) => ({ ...prev, [code]: true }));
        setRemovePreloader(true);
        dispatch(toggleChangesPreloader(true));
  
        try {   
            const response = await fetch(url ,credentials);

            if (!response.ok) {
                const errorData = await response.json();

                throw new Error("Failed to remove the coupon!");
            }
            
            const data = await response.json();
            console.log('remove Coupon', data)
            dispatch(loadCartFromWoo(data));
            closeModal();
  
        } catch (error) {
          console.error("Error while applying the coupon:", error);
        } finally{
            dispatch(toggleChangesPreloader(false));
            setRemovePreloader(false);

            setCouponApplyPreloader((prev) => {
                const updatedPreloader = { ...prev };
                delete updatedPreloader[code];
                return updatedPreloader;
            });
        }
    };

    const confettiSuccess = () => {
        console.log("Confetti animation complete!");
        window.setTimeout(()=>{
            closeModal();
        }, 1000)
    };
  
    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchCoupons();
        }
    }, []);

    return (
        <>
            <div className={`px-5 py-3  ${!cartData.coupons.length ? 'cursor-pointer' : '' } `} onClick={!cartData.coupons.length ? toggleModal : null}>
                <div className="flex">
                    <div className="flex items-start flex-1 pr-2">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 mt-1 max-w-[1rem] w-full h-auto">
                            <path fillRule="evenodd" clipRule="evenodd" d="M15.0167 2.74015L14.8893 2.79164L13.1203 3.59164C12.4748 3.88255 11.7384 3.909 11.0765 3.67098L10.8803 3.59164L9.11027 2.79164C8.81027 2.65164 8.48027 2.65164 8.18027 2.77164C7.91455 2.88307 7.70688 3.07531 7.58432 3.31689L7.53027 3.44164L6.84927 5.26164C6.59352 5.93081 6.08484 6.47393 5.43955 6.76778L5.26027 6.84164L3.45027 7.52164C3.13927 7.64164 2.90027 7.87164 2.77027 8.18164C2.66741 8.43878 2.65271 8.71797 2.73878 8.98141L2.79027 9.11164L3.59027 10.8816C3.89277 11.5325 3.91797 12.2757 3.66589 12.942L3.59027 13.1216L2.79027 14.8816C2.65027 15.1816 2.65027 15.5116 2.77027 15.8216C2.88169 16.0788 3.0732 16.2845 3.3215 16.4136L3.45027 16.4716L5.26027 17.1516C5.9386 17.4083 6.47409 17.9087 6.77352 18.5603L6.84927 18.7416L7.53027 20.5516C7.63927 20.8616 7.88027 21.1016 8.18027 21.2216C8.32027 21.2816 8.48027 21.3116 8.63027 21.3116C8.75027 21.3116 8.87589 21.2948 8.9987 21.2568L9.12027 21.2116L10.8803 20.4116C11.5311 20.1091 12.2744 20.0839 12.9406 20.336L13.1203 20.4116L14.8893 21.2116C15.1903 21.3416 15.5203 21.3516 15.8203 21.2216C16.086 21.1188 16.2929 20.9278 16.4159 20.6801L16.4703 20.5516L17.1503 18.7416C17.4069 18.0633 17.9157 17.5194 18.561 17.2255L18.7403 17.1516L20.5503 16.4716C20.8603 16.3516 21.0993 16.1216 21.2303 15.8216C21.3323 15.5559 21.3468 15.2755 21.2614 15.0119L21.2103 14.8816L20.4103 13.1216C20.1194 12.4762 20.0929 11.7398 20.3309 11.0778L20.4103 10.8816L21.2103 9.11164C21.3493 8.81164 21.3493 8.48164 21.2303 8.18164C21.118 7.91593 20.9263 7.70899 20.6787 7.57972L20.5503 7.52164L18.7403 6.84164C18.0711 6.59414 17.528 6.08615 17.2264 5.44092L17.1503 5.26164L16.4703 3.44164C16.3603 3.14164 16.1303 2.90164 15.8203 2.77164C15.5631 2.66878 15.2766 2.65409 15.0167 2.74015ZM16.4299 14.7516C16.4299 13.8216 15.6799 13.0616 14.7499 13.0616C13.8199 13.0616 13.0699 13.8216 13.0699 14.7516C13.0699 15.6816 13.8199 16.4316 14.7499 16.4316C15.6799 16.4316 16.4299 15.6816 16.4299 14.7516ZM15.2101 7.72159C15.0701 7.61159 14.9101 7.56159 14.7501 7.56159C14.5201 7.56159 14.2901 7.67159 14.1401 7.87159L8.6401 15.2016C8.5101 15.3716 8.4601 15.5716 8.4901 15.7716C8.5201 15.9816 8.6301 16.1516 8.7901 16.2816C9.1201 16.5216 9.6201 16.4516 9.8601 16.1216L15.3601 8.79159C15.6201 8.45159 15.5501 7.97159 15.2101 7.72159ZM10.9299 9.25159C10.9299 8.32159 10.1799 7.56159 9.2499 7.56159C8.3199 7.56159 7.5699 8.32159 7.5699 9.25159C7.5699 10.1816 8.3199 10.9316 9.2499 10.9316C10.1799 10.9316 10.9299 10.1816 10.9299 9.25159Z" fill="#17B31B"></path><path fillRule="evenodd" clipRule="evenodd" d="M17.8393 2.73944C17.5575 2.11859 17.0418 1.61747 16.4103 1.35164C15.7203 1.07164 14.9303 1.08164 14.2503 1.39164L12.4503 2.21164L12.3195 2.25566C12.0539 2.32878 11.7674 2.31164 11.5103 2.19164L9.75027 1.39164L9.53164 1.30524C9.23763 1.20284 8.93427 1.15164 8.63027 1.15164C8.28027 1.15164 7.92027 1.22164 7.59027 1.35164C6.90027 1.64164 6.34927 2.21164 6.09027 2.91164L5.41027 4.72164L5.35929 4.83824C5.22667 5.10211 5.00027 5.30664 4.72027 5.41164L2.91027 6.09164L2.73805 6.1626C2.11713 6.44428 1.61602 6.95914 1.36027 7.59164C1.07027 8.28164 1.08027 9.07164 1.38927 9.75164L2.20027 11.5116L2.25169 11.6472C2.33741 11.9233 2.32027 12.2245 2.20027 12.4816L1.38927 14.2516L1.31241 14.4397C1.08093 15.0745 1.09663 15.7844 1.36027 16.4116C1.63927 17.1016 2.21027 17.6416 2.91027 17.9116L4.72027 18.5916L4.83687 18.6426C5.10073 18.7751 5.30527 19.0004 5.41027 19.2716L6.09027 21.0916L6.16101 21.2636C6.44206 21.8831 6.95777 22.3758 7.59027 22.6416C8.28027 22.9316 9.07027 22.9116 9.75027 22.6016L11.5103 21.8016L11.6459 21.7502C11.9221 21.6645 12.2246 21.6816 12.4903 21.8016L14.2503 22.6016L14.4383 22.679C15.0731 22.9127 15.783 22.9053 16.4103 22.6416C17.0993 22.3516 17.6503 21.7916 17.9103 21.0916L18.5903 19.2716L18.6412 19.1583C18.7739 18.9012 19.0003 18.6966 19.2803 18.5916L21.0903 17.9016L21.2625 17.8309C21.8832 17.5506 22.3835 17.0441 22.6393 16.4116C22.9303 15.7216 22.9103 14.9316 22.6103 14.2516L21.8003 12.4816L21.7488 12.3466C21.6631 12.0725 21.6803 11.7774 21.8003 11.5116L22.6103 9.75164L22.6874 9.56136C22.9196 8.92057 22.9038 8.21891 22.6393 7.59164C22.3603 6.90164 21.7903 6.35164 21.0903 6.09164L19.2803 5.41164L19.1637 5.36066C18.8998 5.22805 18.6953 5.00164 18.5903 4.72164L17.9103 2.91164L17.8393 2.73944ZM14.8893 2.79164L15.0167 2.74015C15.2766 2.65409 15.5631 2.66878 15.8203 2.77164C16.1303 2.90164 16.3603 3.14164 16.4703 3.44164L17.1503 5.26164L17.2264 5.44092C17.528 6.08615 18.0711 6.59414 18.7403 6.84164L20.5503 7.52164L20.6787 7.57972C20.9263 7.70899 21.118 7.91593 21.2303 8.18164C21.3493 8.48164 21.3493 8.81164 21.2103 9.11164L20.4103 10.8816L20.3309 11.0778C20.0929 11.7398 20.1194 12.4762 20.4103 13.1216L21.2103 14.8816L21.2614 15.0119C21.3468 15.2755 21.3323 15.5559 21.2303 15.8216C21.0993 16.1216 20.8603 16.3516 20.5503 16.4716L18.7403 17.1516L18.561 17.2255C17.9157 17.5194 17.4069 18.0633 17.1503 18.7416L16.4703 20.5516L16.4159 20.6801C16.2929 20.9278 16.086 21.1188 15.8203 21.2216C15.5203 21.3516 15.1903 21.3416 14.8893 21.2116L13.1203 20.4116L12.9406 20.336C12.2744 20.0839 11.5311 20.1091 10.8803 20.4116L9.12027 21.2116L8.9987 21.2568C8.87589 21.2948 8.75027 21.3116 8.63027 21.3116C8.48027 21.3116 8.32027 21.2816 8.18027 21.2216C7.88027 21.1016 7.63927 20.8616 7.53027 20.5516L6.84927 18.7416L6.77352 18.5603C6.47409 17.9087 5.9386 17.4083 5.26027 17.1516L3.45027 16.4716L3.3215 16.4136C3.0732 16.2845 2.88169 16.0788 2.77027 15.8216C2.65027 15.5116 2.65027 15.1816 2.79027 14.8816L3.59027 13.1216L3.66589 12.942C3.91797 12.2757 3.89277 11.5325 3.59027 10.8816L2.79027 9.11164L2.73878 8.98141C2.65271 8.71797 2.66741 8.43878 2.77027 8.18164C2.90027 7.87164 3.13927 7.64164 3.45027 7.52164L5.26027 6.84164L5.43955 6.76778C6.08484 6.47393 6.59352 5.93081 6.84927 5.26164L7.53027 3.44164L7.58432 3.31689C7.70688 3.07531 7.91455 2.88307 8.18027 2.77164C8.48027 2.65164 8.81027 2.65164 9.11027 2.79164L10.8803 3.59164L11.0765 3.67098C11.7384 3.909 12.4748 3.88255 13.1203 3.59164L14.8893 2.79164Z" fill="#17B31B">
                            </path>
                        </svg>

                        <div className="flex flex-col">
                            {
                                cartData.coupons.length ? (
                                    <h4 className="font-medium">
                                        <span className="uppercase">&quot;{cartData.coupons[0].code}&quot;</span> applied
                                    </h4>
                                ) : (
                                    <h4 className="font-medium">Coupons and offers</h4>
                                )
                            }

                            {
                                cartData.coupons.length ? (
                                    <span className="inline-block mt-1 text-xs text-[#4d4d4d] font-medium">
                                        You saved additional {cartData.coupons[0].totals.currency_prefix}{cartData.coupons[0].totals.total_discount}
                                    </span>
                                ) : (
                                <span className="inline-block mt-1 text-xs text-[#4d4d4d] font-medium">
                                    Save more with coupon and offers
                                </span>
                                )
                            }

                        </div>
                    </div>

                    {
                        cartData.coupons.length ? (
                            removePreloader ? (
                                <div className="relative min-w-16">
                                    <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-end pr-4"
                                        role="status">
                                            <svg
                                                aria-hidden="true"
                                                className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-[#146EB4]"
                                                viewBox="0 0 100 101"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"
                                                />
                                                <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"
                                                />
                                            </svg>
                                            <span className="sr-only">Loading...</span>
                                    </div>
                                </div>

                                
                            ) : (   
                                <div className="min-w-16">
                                    <button
                                        onClick={() => removeCoupon(cartData.coupons[0].code)} 
                                        className="text-sm font-medium text-[#4d4d4d] items-center gap-1 cursor-pointer h-full leading-base">
                                        Remove
                                    </button>
                                </div>
                            )
                        ) : (
                            <div className="offers flex text-sm text-[#146EB4] font-medium items-center gap-1 cursor-pointer h-full leading-none">
                                {couponsData.length && couponsData.length} Offer{(couponsData.length > 1) ? 's': ''}

                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" color="var(--primary)"><path fillRule="evenodd" clipRule="evenodd" d="M6.19526 13.138C5.93491 12.8776 5.93491 12.4555 6.19526 12.1952L10.3905 7.99992L6.19526 3.80466C5.93491 3.54431 5.93491 3.1222 6.19526 2.86185C6.45561 2.6015 6.87772 2.6015 7.13807 2.86185L11.8047 7.52851C12.0651 7.78886 12.0651 8.21097 11.8047 8.47132L7.13807 13.138C6.87772 13.3983 6.45561 13.3983 6.19526 13.138Z" fill="currentColor"></path></svg>
                            </div>
                        )
                    }
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div
                    id="default-modal"
                    className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full bg-[#00000080]"
                >
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 max-w-[450px] mx-auto">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Coupons and offers
                                </h3>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>

                            <div className="p-4 md:p-5 space-y-4">
                                <form className="mb-8" onSubmit={(e) => (handleSubmitCoupon(e))}>
                                    <div className="form-group relative">
                                        <input
                                            className={`uppercase w-full py-[10px] pl-4 pr-[70px] border border-[#d9d9d9] rounded-md outline-none transition-all focus:border-[#146eb4]`}
                                            type="text"
                                            name="applyCoupon"
                                            id="applyCoupon"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Enter coupon code"
                                        />

                                        {!applyPreloader ? (
                                            <button type="submit" className="absolute top-2/4 right-4 middle -translate-y-1/2 text-[#EE741F] disabled:opacity-50 font-medium" 
                                                disabled={!couponCode}>Apply</button>
                                        ) : (
                                            <div
                                                className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-end pr-4"
                                                role="status"
                                                >
                                                <svg
                                                    aria-hidden="true"
                                                    className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-[#EE741F]"
                                                    viewBox="0 0 100 101"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                    fill="currentColor"
                                                    />
                                                    <path
                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                    fill="currentFill"
                                                    />
                                                </svg>
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        )}
                                    </div>

                                    {inputErrorMessage && (
                                        <p className="mt-1 text-sm font-medium text-[#e50b20]"
                                            dangerouslySetInnerHTML={{ __html: inputErrorMessage }}
                                        />
                                    )}
                                    
                                </form>

                                <div className="flex flex-col">
                                    {
                                        couponsData && 

                                        <>
                                            <Confetti ref={confettiRef} onSuccess={confettiSuccess}/>
                                            <h4 className="text-base text-black font-semibold">
                                                Available coupons
                                            </h4>
        
                                            <div className="w-16 h-1 bg-[#EE741F] mt-2 mb-5"></div>
                                            
                                            {
                                                couponsData.map((coupon, index) => (
                                                    <div key={`couponKey-${coupon.code}`} className="couponCard flex flex-col gap-3 pb-4 border-b border-[#e6e6e6] mb-4">
                                                        <div className="flex justify-between items-center">
                                                            <div className="overflow-hidden">
                                                                <div className="couponCodeWrap uppercase text-black font-medium py-0.5 px-3 border border-[#EE741F] bg-[#EE741F1A] leading-5 relative rounded-sm">
                                                                    {coupon.code}
            
                                                                    <div className="circle absolute top-2/4 -left-[6px] -translate-y-1/2 bg-white rounded-full aspect-square w-3 h-3 border border-[#EE741F]"></div>
                                                                    <div className="circle absolute top-2/4 -right-[6px] -translate-y-1/2 bg-white rounded-full aspect-square w-3 h-3 border border-[#EE741F]"></div>
                                                                </div>
                                                            </div>
            
            
                                                            <div className="relative min-w-12">
                                                                {
                                                                    // cartData.coupons.length > 0 && (
                                                                        coupon.code !== cartData?.coupons[0]?.code ? (
                                                                            couponApplyPreloader[coupon.code] ? (
                                                                                <div className="text-center flex items-center justify-center">
                                                                                    <span className="loader inline-block w-4 h-4 border-2 border-[#EE741F] border-t-transparent rounded-full animate-spin"></span>
                                                                                </div>
                                                                            ) : (
                                                                                <button
                                                                                    className="text-[#EE741F] uppercase text-sm font-medium disabled:opacity-50"
                                                                                    onClick={() => applyCoupon(coupon.code)}
                                                                                    disabled={
                                                                                        parseFloat(cartData.totals.total_price) < parseFloat(coupon.minimum_amount)
                                                                                    }
                                                                                >
                                                                                    Apply
                                                                                </button>
                                                                            )
                                                                        ) : (
                                                                            couponApplyPreloader[coupon.code] ? (
                                                                                <div className="text-center flex items-center justify-center">
                                                                                    <span className="loader inline-block w-4 h-4 border-2 border-[#EE741F] border-t-transparent rounded-full animate-spin"></span>
                                                                                </div>
                                                                            ) : (
                                                                                <button
                                                                                    className="text-[#EE741F] uppercase text-sm font-medium disabled:opacity-50"
                                                                                    onClick={() => removeCoupon(coupon.code)}
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                            )
                                                                        )
                                                                    // )
                                                                }
            
                                                            </div>
                                                        </div>
                                                        
                                                        {
                                                            parseFloat(coupon.minimum_amount) && 
                                                            parseFloat(cartData.totals.total_price) < parseFloat(coupon.minimum_amount) ? (
                                                                <p className="text-sm font-medium text-[#e50b20]">
                                                                    Add items worth ₹{coupon.minimum_amount - cartData.totals.total_price} more to get this offer
                                                                </p>
                                                            ) : null
                                                        }
            
                                                        {/* Show error message if there's an error for this coupon */}
                                                        {couponErrors[coupon.code] && (
                                                            <p className="text-sm font-medium text-[#e50b20]">
                                                                {couponErrors[coupon.code]}
                                                            </p>
                                                        )}
            
            
                                                        {coupon.description && 
                                                            <p className="text-sm font-medium text-black">
                                                                {coupon.description}
                                                            </p>
                                                        }
            
                                                        {/* <div className="collapsable">
                                                            <p  onClick={toggleCollapse}
                                                                className="text-sm font-medium text-black inline-flex items-end leading-none cursor-pointer">
                                                                Details
            
                                                                <svg width="18" height="18" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><g fill="currentColor" fillRule="nonzero"><g><g><g><path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" transform="translate(-1248 -147) translate(1191 142) translate(16 3) translate(41 2)"></path></g></g></g></g></g></svg>
                                                            </p>
            
                                                            {
                                                                isDetailsOpen &&
                                                                
                                                                <div className="collapsable-content text-xs text-[#808080]">
                                                                    <ul className="list-disc pl-5 flex flex-col gap-1 mt-2">
                                                                        <li>
                                                                            Applicable on both online payment and COD
                                                                        </li>
                    
                                                                        <li>
                                                                            Applicable only once per user
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            }
                                                        </div> */}
                                                    </div>
                                                ))
                                            }
                                        </>
                                    }

                                    {
                                        !couponsData &&
                                        <h4 className="text-base text-center text-[#EE741F] font-semibold">
                                            No coupons available!
                                        </h4>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});

CouponsModule.displayName = 'Coupons Module';
export default CouponsModule;