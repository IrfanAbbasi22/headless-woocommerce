import Cookies from 'js-cookie';

// Fetch the WooCommerce cart data
export const fetchWooCommerceCart = async (cartToken) => {
  console.log('Cookies.wchash', Cookies.get('woocommerce_cart_hash'));
  console.log('Cookies.token', Cookies.get('woocommerce_cart_hash'));

  const url = `${process.env.NEXT_PUBLIC_WOO_URL}/wc/store/cart`;
  const credentials = {
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      // 'Cart-Token': Cookies.get('cart-token'),
      'Cart-Token': Cookies.get('woocommerce_cart_hash') ?? Cookies.get('cart-token') ?? '',
      // Authentication headers can be added here
    },
  };

  try {
    const response = await fetch(url, credentials);
    const data = await response.json();

    // Save Cart Token in Cookie
    if(!Cookies.get('cart-token') && !Cookies.get('woocommerce_cart_hash')){
      const cartToken = response.headers.get('Cart-Token');
      if (cartToken) {
        Cookies.set('cart-token', cartToken, { expires: 2 })
      }
    }
    
    return data; // Return the cart data
  } catch (error) {
    console.error('Error fetching WooCommerce cart:', error);
    return null;
  }
};