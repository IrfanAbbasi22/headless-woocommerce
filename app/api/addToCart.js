import Cookies from 'js-cookie';

export const addToCartAPI = async (id, quantity = 1, updateItem = false, key = '') => {
    // console.log('qtychange', id, quantity, updateItem, key)
    const cookieWCHash = Cookies.get('woocommerce_cart_hash');
    const cookieCartToken = Cookies.get('cart-token');
    
    try {    
        const url = !updateItem 
            ? `${process.env.NEXT_PUBLIC_WOO_URL}/wc/store/cart/add-item`
            : `${process.env.NEXT_PUBLIC_WOO_URL}/wc/store/cart/update-item`;

        const productData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cart-Token': cookieWCHash ?? cookieCartToken ?? '',
            },
            body: JSON.stringify({
                key: updateItem ? key : '', 
                id: id,
                quantity: quantity,
            }),
        };

        const response = await fetch(url, productData);
        
        if (!response.ok) {
            const responseError = await response.json();
            throw new Error('Failed to add product to the cart');

            // return responseError;
        }

        // Save Cart Token in Cookie
        if(!Cookies.get('cart-token') && !Cookies.get('woocommerce_cart_hash')){
            const cartToken = response.headers.get('Cart-Token');
            if (cartToken) {
              Cookies.set('cart-token', cartToken, { expires: 2 })
            }
        }

        const responseData = await response.json();
        return responseData;

    } catch (error) {
        console.error(error.message);
    }
};