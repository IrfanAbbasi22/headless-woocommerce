export const getStates = async (countryCode) => {
    const url = `${process.env.NEXT_PUBLIC_WOO_URL}/nwe/v1/delivery/states`;
    const data = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "cc": countryCode
        }),
    };

    try {
        const response = await fetch(url, data);
        if (!response.ok) {

            const error = await response.json();
            return error;
            throw new Error("Failed to get the states!");
        }

        const states = await response.json();
        return states;
    } catch (error) {
        console.error(error);
        return null;
    }
};