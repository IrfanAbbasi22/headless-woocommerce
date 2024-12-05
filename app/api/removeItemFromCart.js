import Cookies from 'js-cookie';

export const removeItemFromCart = async (key) => {
    const cookieWCHash = Cookies.get('woocommerce_cart_hash');
    const cookieCartToken = Cookies.get('cart-token');

    const url = `${process.env.NEXT_PUBLIC_WOO_URL}/wc/store/cart/items/${key}`;  
    const credentials = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            // 'Cart-Token': cookieCartToken,
            'Cart-Token': cookieWCHash ?? cookieCartToken,
        },
    };

    try {
        const response = await fetch(url, credentials);

        if (!response.ok) {
            throw new Error('Failed to remove the item from Cart!');
        }

        // There's no response in delete item
        return true;
    } catch (error) {
        console.error(error);

        return false;
    }
};