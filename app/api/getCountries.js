export const getCountries = async () => {
    const url = `${process.env.NEXT_PUBLIC_WOO_URL}/nwe/v1/delivery/countries`;
    const credentials = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await fetch(url, credentials);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error("Failed to get the countries!");
        }

        const countries = await response.json();
        return countries;
    } catch (error) {
        console.error(error);
    }
}