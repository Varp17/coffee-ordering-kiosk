import { create } from 'zustand';
import { orderService } from '../services/orders';
import { useCartStore } from './useCartStore';
import { unwrapObject } from '../utils/apiResponse';

export const useOrderStore = create((set, get) => ({
  // Delivery address & fulfillment
  deliveryAddress: {
    fullName: 'Arya Kagathara',
    phone: '9876543210',
    flatNo: 'Flat 402, Sunshine Apartments',
    street: '100 Feet Road, Indiranagar',
    landmark: 'Near Metro Station',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    addressType: 'Home',
  },

  // Order state
  orderId: null,
  token: null,
  status: 'idle', // 'idle' | 'preparing' | 'ready' | 'done' | 'placing' | 'error'
  placedAt: null,

  setDeliveryAddress: (address) =>
    set((state) => ({ deliveryAddress: { ...state.deliveryAddress, ...address } })),

  createPaymentOrder: async (customer = {}) => {
    set({ status: 'placing' });
    try {
      const cartItems = useCartStore.getState().items;
      if (cartItems.length === 0) throw new Error('Your cart is empty');

      const hasCombo = cartItems.some(
        (i) => i.isCombo || i.is_combo || (i.name && i.name.toLowerCase().includes('combo'))
      );

      const items = cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.qty || 1,
        name: item.name,
        size: item.size,
        addons: item.addons || [],
        is_combo: !!(item.isCombo || item.is_combo || (item.name && item.name.toLowerCase().includes('combo'))),
      }));

      const addressObj = customer.shippingAddress || get().deliveryAddress || {};
      const fullAddressString = customer.address || `${addressObj.flatNo || ''}, ${addressObj.street || ''}, ${addressObj.city || 'Bengaluru'} - ${addressObj.pincode || ''}`;

      const orderData = {
        items,
        is_combo: hasCombo,
        shipping_address: {
          name: customer.name || addressObj.fullName || 'Valued Customer',
          phone: customer.phone || addressObj.phone || '',
          address: fullAddressString,
          flat_no: addressObj.flatNo || '',
          street: addressObj.street || '',
          city: addressObj.city || 'Bengaluru',
          pincode: addressObj.pincode || '',
          landmark: addressObj.landmark || '',
          order_type: 'delivery',
          location_name: 'CHILLD Express Delivery',
          is_combo: hasCombo,
        },
      };

      const res = await orderService.create(orderData);
      const payload = unwrapObject(res);
      const order = payload.order;
      const razorpayOrder = payload.razorpayOrder;

      if (!order?.id || !razorpayOrder?.id || !payload.key_id) {
        throw new Error('The payment gateway did not return a valid checkout order');
      }

      set({
        orderId: order.id,
        token: order.order_number || order.id.slice(0, 8).toUpperCase(),
        status: 'placing',
        placedAt: new Date().toISOString(),
      });

      return {
        success: true,
        order,
        razorpayOrder,
        keyId: payload.key_id,
      };
    } catch (error) {
      set({ status: 'error' });
      return { success: false, error: error.message };
    }
  },

  completePayment: async (paymentDetails) => {
    try {
      const { orderId } = get();
      if (!orderId) throw new Error('No active order ID to confirm payment');

      const res = await orderService.verifyPayment({
        order_id: orderId,
        razorpay_payment_id: paymentDetails.razorpay_payment_id,
        razorpay_order_id: paymentDetails.razorpay_order_id,
        razorpay_signature: paymentDetails.razorpay_signature,
      });

      const payload = unwrapObject(res);
      set({
        status: 'preparing',
        placedAt: payload.order?.created_at || new Date().toISOString(),
      });

      return { success: true, order: payload.order };
    } catch (error) {
      set({ status: 'error' });
      return { success: false, error: error.message };
    }
  },

  resetOrder: () =>
    set({
      orderId: null,
      token: null,
      status: 'idle',
      placedAt: null,
    }),
}));
