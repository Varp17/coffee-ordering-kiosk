const CHECKOUT_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

let checkoutPromise;

export function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (checkoutPromise) return checkoutPromise;

  checkoutPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${CHECKOUT_SCRIPT_URL}"]`);
    const script = existing || document.createElement('script');

    const handleLoad = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
      } else {
        checkoutPromise = undefined;
        reject(new Error('Razorpay Checkout did not initialise'));
      }
    };

    const handleError = () => {
      checkoutPromise = undefined;
      reject(new Error('Unable to load Razorpay Checkout'));
    };

    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });

    if (!existing) {
      script.src = CHECKOUT_SCRIPT_URL;
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return checkoutPromise;
}
