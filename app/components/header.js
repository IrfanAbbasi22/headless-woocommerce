'use client';
import { useSelector, useDispatch } from 'react-redux';
import { selectTotalItems } from '../store/slices/cartSlice';
import { currentSelectedStep, setCurrentStep } from '../store/slices/cartStepsSlice';
import Image from "next/image";
import { usePathname } from 'next/navigation';
import Link from "next/link";



export default function Header(){
    const pathname = usePathname();
    
    // Cart related
    const totalItems = useSelector(selectTotalItems);
    const currStep = useSelector(currentSelectedStep);
    const dispatch = useDispatch();

    const handleStepClick = (step) => {
        if (currStep === 'cart' && step === 'shipping') {
          dispatch(setCurrentStep('shipping'));
        } else if (currStep === 'shipping' && step === 'payment') {
          dispatch(setCurrentStep('payment'));
        } else if (currStep === 'payment' && step === 'shipping') {
          dispatch(setCurrentStep('shipping'));
        } else if (currStep === 'shipping' && step === 'cart') {
          dispatch(setCurrentStep('cart'));
        } else if (currStep === 'payment' && step === 'cart') {
          dispatch(setCurrentStep('cart'));
        }
    };

    return(
        <header className="main__header py-4 border-b border-[#e6e6e6] bg-white sticky top-0 z-50">
            <nav className="container flex justify-between gap-5 mx-auto items-center">
                <Link href="/" className="nav-logo max-w-[320px] max-lg:max-w-[225px] w-full">
                    <Image src="/checkout/nexgen-logo-black.png" priority width={200} height={48} alt="Nexgen"/>
                </Link>

                <ul className="steps flex max-w-[380px] uppercase text-sm mx-4 w-full justify-center justify-between text-[grey] max-lg:hidden">
                    <li className={`flex gap-2 items-center bg-white 
                        ${ (currStep === 'cart' && pathname === '/cart') ? 'active' : ''}
                        ${ ((currStep === 'shipping' || currStep === 'payment') && pathname === '/cart')  ? 'completed' : ''} `}
                        onClick={() => (currStep === 'cart' || currStep === 'shipping' || currStep === 'payment') && handleStepClick('cart')}>
                        <span className={`inline-flex justify-center items-center w-[20px] text-white rounded-[50%] aspect-square rounded bg-[grey]`} >1</span> Cart
                    </li>
                    
                    <li className={`flex gap-2 items-center bg-white 
                        ${ (currStep === 'shipping' && pathname === '/cart') ? 'active' : ''}
                        ${ (currStep === 'payment' && pathname === '/cart') ? 'completed' : ''}`}
                        onClick={() => (currStep === 'shipping' || currStep === 'payment') && handleStepClick('shipping')}>
                        <span className="inline-flex justify-center items-center w-[20px] text-white rounded-[50%] aspect-square rounded bg-[grey] ">2</span> Address
                    </li>

                    <li className={`flex gap-2 items-center bg-white 
                        ${ (currStep === 'payment' && pathname === '/cart') ? 'active' : ''}`}
                        onClick={() => (currStep === 'payment') && handleStepClick('payment')}>
                        <span className="inline-flex justify-center items-center w-[20px] text-white rounded-[50%] aspect-square rounded bg-[grey] ">3</span> Payment
                    </li>
                </ul>




                {/* Small Screen Steps */}
                <span className="step-count lg:hidden">
                    1/3
                </span>

                <ul className="nav-logo max-w-[320px] w-full flex items-center gap-2 justify-end max-lg:fixed max-lg:bottom-0 max-lg:left-0 max-lg:w-full max-lg:justify-center max-lg:max-w-[100%] max-lg:px-3 max-lg:py-4 max-lg:bg-white">
                    <li>
                        <Link href="/shop" className={`inline-flex gap-2 items-center text-sm font-medium px-3 py-2 rounded-[20px] ${pathname === '/shop' ? 'bg-[#146EB41A] text-[#146EB4] font-semibold' : ''}`}>
                            <svg className="max-w-5 h-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" alt="Categories" color="var(--black-30)" text=""><path d="M20.4971 13C21.3255 13 21.9971 13.6716 21.9971 14.5V20.5C21.9971 21.3284 21.3255 22 20.4971 22H14.4971C13.6686 22 12.9971 21.3284 12.9971 20.5V14.5C12.9971 13.6716 13.6686 13 14.4971 13H20.4971ZM9.5 13C10.3284 13 11 13.6716 11 14.5V20.5C11 21.3284 10.3284 22 9.5 22H3.5C2.67157 22 2 21.3284 2 20.5V14.5C2 13.6716 2.67157 13 3.5 13H9.5ZM20.297 14.7H14.697V20.3H20.297V14.7ZM9.3 14.7H3.7V20.3H9.3V14.7ZM9.5 2C10.3284 2 11 2.67157 11 3.5V9.5C11 10.3284 10.3284 11 9.5 11H3.5C2.67157 11 2 10.3284 2 9.5V3.5C2 2.67157 2.67157 2 3.5 2H9.5ZM20.4971 2C21.3255 2 21.9971 2.67157 21.9971 3.5V9.5C21.9971 10.3284 21.3255 11 20.4971 11H14.4971C13.6686 11 12.9971 10.3284 12.9971 9.5V3.5C12.9971 2.67157 13.6686 2 14.4971 2H20.4971ZM9.3 3.7H3.7V9.3H9.3V3.7ZM20.297 3.7H14.697V9.3H20.297V3.7Z" fill="currentColor"></path></svg>
                            Shop
                        </Link>
                    </li>
                    
                    <li>
                        <Link href="/cart" className={`relative inline-flex gap-2 items-center text-sm font-medium px-3 py-2 rounded-[20px] ${pathname === '/cart' ? 'bg-[#146EB41A] text-[#146EB4] font-semibold' : ''}`}>
                            <svg className="max-w-5 h-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" alt="Bag" color="var(--black-30)" text="">
                                <path d="M17.5303 2C17.7769 2 18.0091 2.1161 18.157 2.31336L20.9105 5.985C20.9338 6.01451 20.955 6.04575 20.974 6.07848C20.9829 6.09427 20.9915 6.11041 20.9995 6.12681C21.0067 6.14109 21.0133 6.15592 21.0196 6.17098C21.0243 6.18292 21.0289 6.19482 21.0331 6.20682C21.0407 6.22728 21.0472 6.24826 21.0528 6.2696C21.0698 6.33447 21.0787 6.40189 21.0787 6.47005V19.3733C21.0787 20.824 19.9027 22 18.452 22H5.54873C4.09802 22 2.922 20.824 2.922 19.3733V6.47005C2.922 6.36611 2.94267 6.26389 2.98211 6.16909C2.98795 6.15455 2.99438 6.14034 3.00121 6.12636C3.02283 6.08242 3.04873 6.03994 3.07868 6L3.027 6.07799C3.02812 6.07606 3.02925 6.07413 3.03039 6.07221L3.07868 6L5.84366 2.31336C5.99161 2.1161 6.2238 2 6.47038 2H17.5303ZM19.511 7.253H4.488L4.48882 19.3733C4.48882 19.8806 4.84525 20.3047 5.32135 20.4087L5.43324 20.427L5.54873 20.4332H18.452C19.0373 20.4332 19.5119 19.9586 19.5119 19.3733L19.511 7.253ZM15.687 9.37327C16.1196 9.37327 16.4704 9.72402 16.4704 10.1567C16.4704 12.6254 14.4691 14.6267 12.0003 14.6267C9.5316 14.6267 7.53029 12.6254 7.53029 10.1567C7.53029 9.72402 7.88104 9.37327 8.3137 9.37327C8.74637 9.37327 9.09711 9.72402 9.09711 10.1567C9.09711 11.7601 10.3969 13.0599 12.0003 13.0599C13.6037 13.0599 14.9036 11.7601 14.9036 10.1567C14.9036 9.72402 15.2543 9.37327 15.687 9.37327ZM17.1386 3.56682H6.86117L5.27 5.686H18.728L17.1386 3.56682Z" fill="currentColor">
                                </path>
                            </svg>

                            {/* Item Qty Component */}
                            {totalItems > 0 && (
                                <span className="absolute -top-[2px] -left-[1px] bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                            Cart
                        </Link>
                    </li>
                    
                    <li>
                        <Link href="/index" className={`inline-flex gap-2 items-center text-sm font-medium px-3 py-2 rounded-[20px] ${pathname === '/account' ? 'bg-[#146EB41A] text-[#146EB4] font-semibold' : ''}`}>
                            <svg className="max-w-5 h-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" alt="Account" color="var(--black-30)" text=""><path d="M15.9255 13.7621C18.9394 13.7621 21.3459 16.3793 21.4562 19.6018L21.4602 19.833V21.0911C21.4602 21.6264 21.0536 22.0672 20.5314 22.1236L20.4178 22.1297H3.57165C3.03435 22.1297 2.59201 21.7246 2.53541 21.2042L2.5293 21.0911V19.833C2.5293 16.5828 4.86571 13.89 7.84974 13.7665L8.06396 13.7621H15.9255ZM15.9255 15.5623H8.06396C6.09351 15.5623 4.4325 17.3302 4.33364 19.6171L4.32899 19.833L4.32799 20.3288H19.6605V19.833C19.6605 17.5149 18.0592 15.6768 16.1093 15.5675L15.9255 15.5623ZM11.9947 2.60028C14.6914 2.60028 16.8734 4.79535 16.8734 7.49817C16.8734 10.201 14.6914 12.3961 11.9947 12.3961C9.29806 12.3961 7.11604 10.201 7.11604 7.49817C7.11604 4.79535 9.29806 2.60028 11.9947 2.60028ZM11.9947 4.40053C10.2953 4.40053 8.91574 5.78635 8.91574 7.49817C8.91574 9.20999 10.2953 10.5958 11.9947 10.5958C13.6942 10.5958 15.0737 9.20999 15.0737 7.49817C15.0737 5.78635 13.6942 4.40053 11.9947 4.40053Z" fill="currentColor"></path></svg>
                            Account
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}