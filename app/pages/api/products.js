export default async function handler(req, res) {
    const url = `${process.env.NEXT_PUBLIC_WOO_URL}/wc/v3/products`;
    const credentials = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_CONSUMER_SECRET}`),
        },
    };

    try {
        const response = await fetch(url, credentials);

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch products' });
        }

        const products = await response.json();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
