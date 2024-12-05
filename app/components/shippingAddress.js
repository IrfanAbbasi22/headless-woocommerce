"use client";
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import Cookies from 'js-cookie';

import { useSelector, useDispatch } from "react-redux";
import { cartDetails, loadCartFromWoo, toggleChangesPreloader } from '../store/slices/cartSlice';

// Get Countries and States
import { getCountries } from '../api/getCountries';
import { getStates } from "../api/getStates";

const ShippingForm = forwardRef((props, ref) => {
    const dispatch = useDispatch();

    const cartData = useSelector(cartDetails);

    // Cookie Data
    const cookieWCHash = Cookies.get('woocommerce_cart_hash');
    const cookieCartToken = Cookies.get('cart-token');

    const [isGetCountriesFired, setIsGetCountriesFired] = useState(false);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    
    // Form Data
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        address_1: "",
        address_2: "",
        state: "",
        postcode: "",
        city: "",
        country: "",
    });

    // load States
    const loadStates = async (cc = cartData?.billing_address?.country) => {
        setFormError('');

        if (!cc || typeof cc !== 'string') {
            console.error("Invalid country code provided:", cc);
            return;
        }

        try {
            const res = await getStates(cc);

            if(res?.error){
                // console.log("inside errors", res);

                setFormError(res?.error || "An error occurred while fetching states.");
            }

            setStates(res);
        } catch (err) {
            console.error("Failed top load States");
        }
    }

    // Load Countries
    const loadCountries = async () => {
        try {
            const res = await getCountries();
            setCountries(res);
            
            // Load states once the countries loaded
            loadStates(cartData?.billing_address?.country);
        } catch (err) {
            console.error("Failed top get countries");
        }
    }

    /**
     * Update Form Data with CartData
     * Check if country exist or not call countries
     * Call states with default country
     */
    useEffect(() => {
        if (cartData?.billing_address) {
            const {
                first_name,
                last_name,
                phone,
                email,
                address_1,
                address_2,
                state,
                postcode,
                city,
                country,
            } = cartData.billing_address;

            setFormData((prev) => ({
                ...prev,
                first_name: first_name || "",
                last_name: last_name || "",
                phone: phone || "",
                email: email || "",
                address_1: address_1 || "",
                address_2: address_2 || "",
                state: state || "",
                postcode: postcode || "",
                city: city || "",
                country: country || "",
            }));
        }

        loadCountries();
    }, [cartData]);

    const [FormError, setFormError] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!formData.first_name.trim()) {
        newErrors.first_name = "First Name is required";
        }
        if (!formData.phone.trim()) {
        newErrors.phone = "Mobile Number is required";
        }
        if (!formData.email.trim()) {
        newErrors.email = "Email Address is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email Address is invalid";
        }
        if (!formData.address_1.trim()) {
        newErrors.address_1 = "Address is required";
        }
        if (!formData.address_2.trim()) {
        newErrors.address_2 = "Locality is required";
        }
        if (!formData.state.trim()) {
        newErrors.state = "State is required";
        }
        if (!formData.postcode.trim()) {
        newErrors.postcode = "Pincode is required";
        }
        if (!formData.city.trim()) {
        newErrors.city = "City is required";
        }

        setErrors(newErrors);
        return newErrors;
    };

    const validateOnblur = (fieldName) => {
        const newErrors = { ...errors };

        // Validate only the field that was blurred
        if (fieldName === "first_name" && !formData.first_name.trim()) {
        newErrors.first_name = "First Name is required";
        }
        if (fieldName === "phone" && !formData.phone.trim()) {
        newErrors.phone = "Mobile Number is required";
        }
        if (fieldName === "email") {
        if (!formData.email.trim()) {
            newErrors.email = "Email Address is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email Address is invalid";
        }
        }
        if (fieldName === "address_1" && !formData.address_1.trim()) {
        newErrors.address_1 = "Address is required";
        }
        if (fieldName === "address_2" && !formData.address_2.trim()) {
        newErrors.address_2 = "Locality is required";
        }
        if (fieldName === "state" && !formData.state.trim()) {
        newErrors.state = "State is required";
        }
        if (fieldName === "postcode" && !formData.postcode.trim()) {
        newErrors.postcode = "Pincode is required";
        }
        if (fieldName === "city" && !formData.city.trim()) {
        newErrors.city = "City is required";
        }

        setErrors(newErrors);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
    };

    const handleBlur = (e) => {
        validateOnblur(e.target.name);
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault(); // Prevent default form submission if event exists
        }

        // Validate all fields before submitting
        const validationErrors = validate();

        // If there are validation errors, don't submit
        if (Object.keys(validationErrors).length > 0) {
            if (props.onFailure) {
                props.onFailure();
            }
            return;
        }

        // Submit form if validation passes
        await updateShippingAddress();
    };

    const updateShippingAddress = async () => {
        const url = `${process.env.NEXT_PUBLIC_WOO_URL}/wc/store/cart/update-customer`;
            const credentials = {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
                'Cart-Token': cookieWCHash ?? cookieCartToken ?? '',
            },
            body: JSON.stringify({
                "billing_address": formData,
                "shipping_address": formData
            }),
        };

        try {
            const response = await fetch(url, credentials);
            if (!response.ok) {
                const errorData = await response.json();

                const shippingErrorData = errorData.data.params?.shipping_address;
                setFormError(shippingErrorData);

                if (props.onFailure) {
                    props.onFailure(errorData);
                }

                throw new Error("Failed to update shipping address!");
            }

            // If handleSuccess is provided, call it
            const successData = await response.json();
            if (props.onSuccess) {
                props.onSuccess(successData);
            }

            // Update Redux Store with updated data
            dispatch(loadCartFromWoo(successData));
            // console.log("Shipping address updated successfully!");
        } catch (error) {
            console.error(error);
        }
    };


    // Exposing the submitForm method to the parent via ref
    useImperativeHandle(ref, () => ({
        submitForm: handleSubmit
    }));

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-x-6">
                <div className="form-group w-full md:w-[calc(50%-12px)] flex flex-col gap-2 pb-8 relative">
                    <label
                        htmlFor="shippingFormFirstName"
                        className="text-[#4d4d4d] text-sm"
                    >
                        First Name <span className="text-red-600">*</span>
                    </label>
                    <input autoComplete="true"
                        className={`py-[10px] px-4 border ${
                        errors.first_name ? "border-red-600" : "border-[#d9d9d9]"
                        } rounded-md outline-none transition-all focus:border-[#146eb4]`}
                        type="text"
                        name="first_name"
                        id="shippingFormFirstName"
                        placeholder="Enter first name"
                        value={formData.first_name}
                        onBlur={handleBlur}
                        onChange={handleInputChange}
                    />

                    {errors.first_name && (
                        <small className="absolute left-0 bottom-3 text-xs text-red-600">
                        {errors.first_name}
                        </small>
                    )}
                </div>

                <div className="form-group w-full md:w-[calc(50%-12px)] flex flex-col gap-2 pb-8 relative">
                    <label
                        htmlFor="shippingFormLastName"
                        className="text-[#4d4d4d] text-sm"
                    >
                        Last Name
                    </label>
                    <input
                        className="py-[10px] px-4 border border-[#d9d9d9] rounded-md outline-none transition-all focus:border-[#146eb4]"
                        type="text"
                        name="last_name"
                        id="shippingFormLastName"
                        placeholder="Enter last name"
                        value={formData.last_name} onBlur={handleBlur}
                        onChange={handleInputChange}
                    
                    />
                </div>

                <div className="form-group w-full md:w-[calc(50%-12px)] flex flex-col gap-2 pb-8 relative">
                    <label
                        htmlFor="shippingFormMobile"
                        className="text-[#4d4d4d] text-sm"
                    >
                        Mobile Number <span className="text-red-600">*</span>
                    </label>
                    <input
                        className={`py-[10px] px-4 border ${
                        errors.phone ? "border-red-600" : "border-[#d9d9d9]"
                        } rounded-md outline-none transition-all focus:border-[#146eb4]`}
                        type="number"
                        name="phone"
                        id="shippingFormMobile"
                        placeholder="Enter mobile number"
                        value={formData.phone}
                        onBlur={handleBlur}
                        onChange={handleInputChange}
                    />

                    {errors.phone && (
                        <small className="absolute left-0 bottom-3 text-xs text-red-600">
                        {errors.phone}
                        </small>
                    )}
                </div>

                <div className="form-group w-full md:w-[calc(50%-12px)] flex flex-col gap-2 pb-8 relative">
                    <label htmlFor="shippingFormEmail" className="text-[#4d4d4d] text-sm">
                        Email Address <span className="text-red-600">*</span>
                    </label>

                    <input
                        className={`py-[10px] px-4 border ${
                        errors.email ? "border-red-600" : "border-[#d9d9d9]"
                        } rounded-md outline-none transition-all focus:border-[#146eb4]`}
                        type="email"
                        name="email"
                        id="shippingFormEmail"
                        placeholder="Enter email"
                        value={formData.email}
                        onBlur={handleBlur}
                        onChange={handleInputChange}
                    />

                    {errors.email && (
                        <small className="absolute left-0 bottom-3 text-xs text-red-600">
                        {errors.email}
                        </small>
                    )}
                </div>

                <div className="form-group w-full flex flex-col gap-2 pb-8 relative">
                    <label
                        htmlFor="shippingFormAddress"
                        className="text-[#4d4d4d] text-sm"
                    >
                        Address <span className="text-red-600">*</span>
                    </label>
                    <input
                        className={`py-[10px] px-4 border ${
                        errors.address_1 ? "border-red-600" : "border-[#d9d9d9]"
                        } rounded-md outline-none transition-all focus:border-[#146eb4]`}
                        type="text"
                        name="address_1"
                        id="shippingFormAddress"
                        placeholder="Enter address"
                        value={formData.address_1}
                        onBlur={handleBlur}
                        onChange={handleInputChange}
                    />

                    {errors.address_1 && (
                        <small className="absolute left-0 bottom-3 text-xs text-red-600">
                        {errors.address_1}
                        </small>
                    )}
                </div>

                <div className="form-group w-full md:w-[calc(50%-12px)] flex flex-col gap-2 pb-8 relative">
                    <label
                        htmlFor="shippingFormLocality"
                        className="text-[#4d4d4d] text-sm"
                    >
                        Locality / Area <span className="text-red-600">*</span>
                    </label>
                    <input
                        className={`py-[10px] px-4 border ${
                        errors.address_2 ? "border-red-600" : "border-[#d9d9d9]"
                        } rounded-md outline-none transition-all focus:border-[#146eb4]`}
                        type="text"
                        name="address_2"
                        id="shippingFormLocality"
                        placeholder="Enter locality/area"
                        value={formData.address_2}
                        onBlur={handleBlur}
                        onChange={handleInputChange}
                    />

                    {errors.address_2 && (
                        <small className="absolute left-0 bottom-3 text-xs text-red-600">
                        {errors.address_2}
                        </small>
                    )}
                </div>

                <div className="form-group w-full md:w-[calc(50%-12px)] flex flex-col gap-2 pb-8 relative">
                    <label
                        htmlFor="shippingFormLandmark"
                        className="text-[#4d4d4d] text-sm"
                    >
                        Landmark (optional)
                    </label>
                    <input
                        className="py-[10px] px-4 border border-[#d9d9d9] rounded-md outline-none transition-all focus:border-[#146eb4]"
                        type="text"
                        name="landmark"
                        id="shippingFormLandmark"
                        placeholder="Enter landmark"
                    />
                </div>

                <div className="form-group w-full md:w-[calc(50%-12px)] flex flex-col gap-2 pb-8 relative">
                    <label
                        htmlFor="shippingFormPincode"
                        className="text-[#4d4d4d] text-sm"
                    >
                        Pincode <span className="text-red-600">*</span>
                    </label>

                    <input
                        className={`py-[10px] px-4 border ${
                        errors.postcode ? "border-red-600" : "border-[#d9d9d9]"
                        } rounded-md outline-none transition-all focus:border-[#146eb4]`}
                        type="number"
                        name="postcode"
                        id="shippingFormPincode"
                        placeholder="Enter postcode"
                        value={formData.postcode}
                        onBlur={handleBlur}
                        onChange={handleInputChange}
                    />

                    {errors.postcode && (
                        <small className="absolute left-0 bottom-3 text-xs text-red-600">
                        {errors.postcode}
                        </small>
                    )}
                </div>

                <div className="form-group w-full md:w-[calc(50%-12px)] flex flex-col gap-2 pb-8 relative">
                    <label htmlFor="shippingFormCity" className="text-[#4d4d4d] text-sm">
                        City <span className="text-red-600">*</span>
                    </label>

                    <input
                        className={`py-[10px] px-4 border ${
                        errors.city ? "border-red-600" : "border-[#d9d9d9]"
                        } rounded-md outline-none transition-all focus:border-[#146eb4]`}
                        type="text"
                        name="city"
                        id="shippingFormCity"
                        placeholder="Enter city"
                        value={formData.city}
                        onBlur={handleBlur}
                        onChange={handleInputChange}
                    />

                    {errors.city && (
                        <small className="absolute left-0 bottom-3 text-xs text-red-600">
                            {errors.city}
                        </small>
                    )}
                </div>

                <div className="form-group w-full md:w-[calc(50%-12px)] flex flex-col gap-2 pb-8 relative">
                    <label htmlFor="shippingFormState" className="text-[#4d4d4d] text-sm">
                        State <span className="text-red-600">*</span>
                    </label>
                    <select
                        name="state"
                        id="shippingFormState"
                        className={`py-[10px] px-4 border ${
                        errors.state ? "border-red-600" : "border-[#d9d9d9]"
                        } rounded-md outline-none transition-all focus:border-[#146eb4]`}
                        value={formData.state}
                        onBlur={handleBlur}
                        onChange={handleInputChange}
                    >
                        <option value="" hidden defaultValue={true}>
                            Select State
                        </option>
                        {states && Object.keys(states).length > 0 && (
                            Object.entries(states).map(([code, name]) => (
                                <option key={`stateCode-${code}`} value={code}>{name}</option>
                            ))
                            )
                        }
                    </select>
                    {errors.state && (
                        <small className="absolute left-0 bottom-3 text-xs text-red-600">
                            {errors.state}
                        </small>
                    )}
                </div>

                <div className="form-group w-full md:w-[calc(50%-12px)] flex flex-col gap-2 pb-8 relative">
                    <label htmlFor="shippingFormCountries" className="text-[#4d4d4d] text-sm">
                        Country <span className="text-red-600">*</span>
                    </label>
                    <select
                        name="country"
                        id="shippingFormCountries"
                        className={`py-[10px] px-4 border ${
                        errors.country ? "border-red-600" : "border-[#d9d9d9]"
                        } rounded-md outline-none transition-all focus:border-[#146eb4]`}
                        value={formData.country}
                        onBlur={handleBlur}
                        onChange={(e) => {
                            loadStates(e.target.value)
                            handleInputChange(e)
                        }}
                    >
                        <option value="" hidden defaultValue={true}>
                            Select country
                        </option>
                        {countries && Object.keys(countries).length > 0 && (
                            Object.entries(countries).map(([code, name]) => (
                                <option key={`countryCode-${code}`} value={code}>{name}</option>
                            ))
                            )
                        }
                    </select>
                    {errors.country && (
                        <small className="absolute left-0 bottom-3 text-xs text-red-600">
                        {errors.country}
                        </small>
                    )}
                </div>

                { FormError &&
                    <div className="form-group w-full text-sm text-red-600 pb-8">
                        {FormError}
                    </div>
                }
            </div>
        </form>
    );
})

ShippingForm.displayName = 'Shipping Form';
export default ShippingForm;