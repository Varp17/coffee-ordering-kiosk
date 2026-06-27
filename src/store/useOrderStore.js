import { create } from 'zustand';
import { orderService } from '../services/orders';
import { useCartStore } from './useCartStore';
import { unwrapData } from '../utils/apiResponse';

// Map local concentrate template IDs to backend product UUIDs.
// Replace these temporary UUIDs when the backend has dedicated bottle SKUs.
const PRODUCT_MAPPING = {
  'coffee-50-50-concentrate': '3e3390c7-3d82-417b-b472-59b46842936a',
  'classic-cb-concentrate': '165c42ad-1e76-4724-9b16-74d9781ff29a',
  'coffee-70-30-concentrate': '42afdd2d-0682-421b-97d6-fbebb56dde61',
  'sif-concentrate': '3e3390c7-3d82-417b-b472-59b46842936a',
  'cascara-concentrate': '2081f9b4-842b-4ff7-af4e-341f4ebce608',
};

const FALLBACK_PRODUCT_ID = PRODUCT_MAPPING['coffee-50-50-concentrate'];

export const useOrderStore = create((set, get) => ({
  // Location & table
  selectedLocation: null,
  orderType:        'dine-in', // 'dine-in' | 'takeaway'
  tableNumber:      null,

  // Order state
  orderId:    null,
  token:      null,
  status:     'idle', // 'idle' | 'preparing' | 'ready' | 'done' | 'placing' | 'error'
  placedAt:   null,

  setLocation: (location) => set({ selectedLocation: location }),
  setOrderType: (type)    => set({ orderType: type, tableNumber: null }),
  setTableNumber: (num)   => set({ tableNumber: num }),

  placeOrder: async (paymentRef) => {
    set({ status: 'placing' });
    try {
      const { selectedLocation, orderType, tableNumber } = get();
      const cartItems = useCartStore.getState().items;

      // Translate local product IDs to backend UUIDs
      const items = cartItems.map(item => {
        const backendUuid = PRODUCT_MAPPING[item.id] || FALLBACK_PRODUCT_ID;
        
        // Construct detailed notes containing customizations and size
        let notesParts = [`Product: ${item.name}`, `Size: ${item.size || 'Default'}`];
        if (item.addons && item.addons.length > 0) {
          notesParts.push(`Addons: ${item.addons.map(a => a.name).join(', ')}`);
        }
        if (item.isCustom && item.ingredients) {
          notesParts.push(`Custom base: ${item.ingredients.concentrate}, sweetener: ${item.ingredients.sweetener}, milk: ${item.ingredients.milk}, topping: ${item.ingredients.topping}`);
        }
        
        return {
          product_id: backendUuid,
          quantity: item.qty || 1,
          notes: notesParts.join(' | ')
        };
      });

      // Parse numeric store ID
      const storeId = selectedLocation ? parseInt(selectedLocation.id.replace('loc', ''), 10) : 1;

      // Construct order request payload
      const orderData = {
        store_id: storeId,
        channel: 'kiosk',
        items,
        notes: `Payment Ref: ${paymentRef} | Type: ${orderType}${tableNumber ? ` | Table: ${tableNumber}` : ''}`
      };

      const res = await orderService.create(orderData);
      const newOrder = unwrapData(res, res);

      set({
        token: newOrder.order_number || `T-${Math.floor(100 + Math.random() * 900)}`,
        status: newOrder.status || 'preparing',
        placedAt: newOrder.created_at || new Date().toISOString(),
        orderId: newOrder.id || newOrder.uuid || `CHD-${Date.now()}`,
      });
      return { success: true };
    } catch (err) {
      set({ status: 'error' });
      return { success: false, error: err.message };
    }
  },

  resetOrder: () =>
    set({
      selectedLocation: null,
      orderType:        'dine-in',
      tableNumber:      null,
      orderId:          null,
      token:            null,
      status:           'idle',
      placedAt:         null,
    }),
}));
