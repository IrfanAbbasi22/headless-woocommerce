export const fetchProductDetails = async (id) => {
  
    const url = `${process.env.NEXT_PUBLIC_WOO_URL}/wc/v3/products/${id}`;
    const credentials = {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_CONSUMER_SECRET}`),
        }
    };

    try {
        const response = await fetch(url, credentials);
        const data = await response.json();

        console.log('Single Product', data);
        return data; // Return the cart data
    } catch (error) {
        console.error('Error fetching Product details:', error);
        return null;
    }
};