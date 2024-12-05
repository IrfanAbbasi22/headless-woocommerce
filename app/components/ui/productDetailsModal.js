"use client";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../store/slices/productDetailModalSlice";

const ProductDetailsModal = () => {
    const { isOpen, productDetails } = useSelector((state) => state.productDetailModal);
    const dispatch = useDispatch();

    if (!isOpen) return null;

    console.log('insid ethe modal', productDetails.attributes)

    return (
        <div
            id="default-modal"
            className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full bg-[#00000080]"
        >
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 max-w-[450px] mx-auto">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Select options
                        </h3>
                        <button
                            type="button"
                            onClick={() => dispatch(closeModal())}
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
                        <div className="flex">
                            <div className="flex flex-col">
                                {productDetails?.name}
                                
                                <div className="productCardPricing flex justify-start items-center gap-2 mt-2 mb-4">
                                    {productDetails?.price && 
                                        <p className="discountedPrice font-semibold"> ₹{productDetails?.price} </p>
                                    }
                                    {productDetails?.on_sale && 
                                        <del className="originalPrice text-sm text-black opacity-50">₹{productDetails?.regular_price}</del>
                                    }
                                    {productDetails?.on_sale &&
                                        <p className="discount text-[#EE741F] text-sm font-medium">({(
                                                ((productDetails?.regular_price - productDetails?.price) / productDetails?.regular_price) * 100
                                            ).toFixed()}% OFF)
                                        </p>
                                    }
                                </div>
                            </div>
                        </div>

                        {
                            productDetails?.attributes && 

                            <div>
                                <h4>Select size</h4>
                                <div className="flex">
                                    {
                                        productDetails.attributes.map((item, index) => {
                                                { item }
                                            <label htmlFor="">
                                                <input type="radio" name="selectCurProductVariation" id="" />
                                            </label>
                                        })
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;
