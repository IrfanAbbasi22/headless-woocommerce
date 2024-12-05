"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { cartDetails, selectCartItems, cartChangesPreloader } from '../store/slices/cartSlice';
import { currentSelectedStep, setCurrentStep } from '../store/slices/cartStepsSlice';

// UI Components
import DotPulsePreloader from "../components/ui/dotPulsePreloader";
import CartProductCard from "../components/ui/cartProductCard";
import ShippingAddress from "../components/shippingAddress";
import PaymentComponent from "../components/paymentComponent";
import CouponsModule from "../components/couponsModule";

export default function CartData() {
  // Data
  const cartItems = useSelector(selectCartItems);
  const cartData = useSelector(cartDetails);
  const currentStep = useSelector(currentSelectedStep);

  const dispatch = useDispatch();
  
  // For Error Handling
  const [error, setError] = useState(null);

  // UI Related
  const [loading, setLoading] = useState(false);
  const [continuePreloader, setContinuePreloader] = useState(false);
  const changesPreloader = useSelector(cartChangesPreloader);

  // console.log('cartdata', cartData);


  // Managing Prices Discounts
  const cartItemsTotalPrice = parseInt(cartItems.reduce((total, item) => total + item.prices.regular_price * item.quantity, 0), 10);
  const cartItemsPrice = parseInt(cartData.totals.total_items, 10);

  const getPercentageOff = (regularPrice, salePrice) => {
    const discountPrice = regularPrice - salePrice;
    return ((discountPrice / regularPrice) * 100).toFixed();
  };

  // Address Form Handling
  const shippingFormRef = useRef();
  const handleFormSubmit = () => {
    setContinuePreloader(true);
    shippingFormRef.current.submitForm();
  };

  const handleSuccess = (data) => {
    console.log("Success function called in parent!", data);
    dispatch(setCurrentStep("payment"));
    setContinuePreloader(false);
  };

  const handleAddressFail = (data) => {
    console.log("Failed function called in parent!", data);
    setContinuePreloader(false);
  };
  // Address Form Handling

  if (loading) {
    return (
      <div className="container mx-auto text-center">Loading Cart Data...</div>
    );
  }

  return (
    <div className="container flex flex-wrap gap-5 mx-auto mb-10 pt-16">
      {cartItems.length ? (
        <div className="flex flex-wrap w-full max-lg:flex-col">
          {/* Cart Data */}
          {currentStep === "cart" && (
            <div className="flex-1 w-full mr-6">
              {/* Cart Heading */}
              <div className="flex justify-between items-center mb-5">
                <span className="text-xl font-medium">
                  Shopping cart
                  {cartData.items_count && (
                    <span className="font-normal">
                      {" "}
                      ({cartData.items_count} Items)
                    </span>
                  )}
                </span>

                {cartData.totals.total_price && (
                  <span className="text-xl font-medium">
                    Total {cartData.totals.currency_prefix}{ cartData.totals.total_price }
                  </span>
                )}
              </div>

              {/* Cart Items */}
              <div className="flex flex-col gap-4">
                {cartItems &&
                cartItems &&
                cartItems.length > 0 ? (
                  cartItems.map((item, index) => (
                    <CartProductCard product={item} key={`cartItem${item.key}`} />
                  ))
                ) : (
                  <div>Your cart is empty.</div>
                )}
              </div>
            </div>
          )}

          {/* Shipping Form */}
          {currentStep === "shipping" && (
            <div className="flex-1 w-[100%] mr-6">
              {/* Address Heading */}
              <div className="flex justify-between items-center mb-5">
                <span className="text-xl font-medium">Shipping address</span>
              </div>

              {/* Form */}
              <ShippingAddress
                ref={shippingFormRef}
                onSuccess={handleSuccess}
                onFailure={handleAddressFail}
              />
            </div>
          )}

          {/* Payment Module */}
          {currentStep === "payment" && (
            <div className="flex-1 w-[100%] mr-6">
              {/* Payment Heading */}
              <div className="flex justify-between items-center mb-5">
                <span className="text-xl font-medium">Choose payment mode</span>
              </div>

              <PaymentComponent />
            </div>
          )}

          <div className="max-w-[380px] w-[100%] lg:sticky lg:top-[90px] lg:h-[max-content] ">
            <div className="cartSidebar border border-[#e6e6e6] rounded-lg mb-3">
              <CouponsModule/>
            </div>

            <div className="cartSidebar border border-[#e6e6e6] rounded-lg">
              <div className="flex flex-col gap-2 p-5">
                <p className="text-sm flex gap-4 justify-between items-center">
                  Item total
                  <span>
                    {
                      cartItemsTotalPrice !== cartItemsPrice && 
                      <del className="text-[grey] mr-1">
                        {cartData.totals.currency_prefix}{cartItemsTotalPrice}
                      </del>
                    }
                    
                    {cartData.totals.currency_prefix}{cartItemsPrice}
                  </span>
                </p>

                    {
                      cartData.totals.total_discount > 0 &&

                      <div className="cartSidebar-delivery flex flex-col">
                        <p className="text-sm flex gap-4 justify-between items-center mb-1">
                          Discount ({cartData?.coupons[0].code.toUpperCase()})
                          <span className="text-[#17b31b] font-medium text-sm">
                            -{cartData.totals.currency_prefix}{cartData.totals.total_discount}
                          </span>
                        </p>
                      </div>
                    }
                
                <div className="cartSidebar-delivery flex flex-col">
                  <p className="text-sm flex gap-4 justify-between items-center mb-1">
                    Delivery fee
                    <span>
                      {/* Need Discussion - how to show discount on delivery if it has */}
                      <del className="text-[grey] mr-1">₹99</del>
                      {cartData.totals.total_shipping === "0" ? (
                        <span className="text-[#17b31b] font-medium text-sm">
                          FREE
                        </span>
                      ) : (
                        `${cartData.totals.currency_prefix}${cartData.totals.total_shipping}`
                      )}
                    </span>
                  </p>
                  {/* Need Discussion - how to show free delivery note */}
                  <small className="text-xs text-[grey]">Free delivery on item total above <span className="text-black font-medium">₹1,000</span></small>
                </div>

                {/* Total */}
                <div className="grand-total flex flex-col border-dashed border-t border-b border-[#e5e7eb] py-4 my-2">
                  {cartData.totals.total_price && (
                    <h4 className="text-base font-medium flex gap-4 justify-between items-center">
                      Grand total
                      <span>
                        {cartData.totals.currency_prefix}{cartData.totals.total_price}
                      </span>
                    </h4>
                  )}

                  <small className="inline-block text-sm text-[grey]">
                    Inclusive of all taxes
                  </small>
                </div>

                {/* Delivery Time */}
                <div className="grand-total flex flex-col gap-4">
                  <small className="inline-block text-sm text-[grey]">
                    Average delivery time:{" "}
                    <span className="text-black font-medium">2-5 days</span>
                  </small>

                  { 
                    // Discount
                    cartItemsTotalPrice !== cartItemsPrice && (
                      <div className="relative sideCartSavings flex flex-col text-[#17b31b] text-center py-2 px-6 rounded bg-[#17B31B1A]">
                          <span className={`text-sm ${(changesPreloader ? 'opacity-0' : '')}`}>
                            {`${getPercentageOff(cartItemsTotalPrice, cartItemsPrice)}% `} 
                            ({cartItemsTotalPrice - cartItemsPrice}) 
                            saved so far on this order
                          </span>
                          {/* Need Discussion - how to show discount on delivery if it has */}
                          <span className={`text-xs ${(changesPreloader ? 'opacity-0' : '')}`}>
                            Save ₹49 on delivery fee by adding ₹701 more to cart
                          </span>

                          { changesPreloader &&
                            // Preloader
                            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <DotPulsePreloader color={'#17b31b'}/>
                            </div>
                          }
                      </div>
                    )
                  }

                </div>
              </div>

              <div className="cartSidebar-action p-2 border-t border-[#e5e7eb]">
                {currentStep !== "payment" && (
                  <>
                    {changesPreloader || continuePreloader ? (
                      <button
                        disabled
                        className="relative w-full transition-all bg-[#146eb4] text-white text-base py-3 px-5 rounded-md
                          disabled:opacity-50"
                      >
                        &nbsp;
                        <div
                          className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center"
                          role="status"
                        >
                          <svg
                            aria-hidden="true"
                            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#146EB4]"
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
                      </button>
                    ) : (
                      <button
                        className="w-full transition-all bg-[#146EB4] hover:bg-[#177ccb] text-white text-base py-3 px-5 rounded-md"
                        onClick={() => {
                          if (currentStep === "cart") {
                            dispatch(setCurrentStep("shipping"));
                          } else if (currentStep === "shipping") {
                            handleFormSubmit();
                          }
                        }}
                      >
                        Continue
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full text-center py-24">
          <Image
            src={"/checkout/empty-cart.svg"}
            width={230}
            height={130}
            alt="Empty Cart"
          />

          <h3 className="text-xl font-medium mt-7 mb-2">Your cart is empty</h3>

          <p className="text-[#808080]">
            Looks like you haven&apos;t made your choice yet..
          </p>

          <Link href={`/`}
            className="bg-[#146EB4] text-white px-8 py-3 rounded hover:bg-[#177ccb] transition-all mt-10"
          >
            Back to homepage
          </Link>
        </div>
      )}
    </div>
  );
}
