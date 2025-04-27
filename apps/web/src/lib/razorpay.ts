export const loadScript = (src: string) => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        };

        script.onerror = () => {
            resolve(false);
        };

        document.body.appendChild(script);
    });
};

export const loadRazorpay = () => {
    try {
        return loadScript("https://checkout.razorpay.com/v1/checkout.js");
    } catch (error) {
        console.log(error);
        return Promise.resolve(false);
    }
};
