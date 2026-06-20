import { create } from 'zustand';
import { orderService } from '../services/orders';
import { useCartStore } from './useCartStore';
import { unwrapData } from '../utils/apiResponse';

// Map of local static product IDs to backend database product UUIDs
const PRODUCT_MAPPING = {
  'p001': '3e3390c7-3d82-417b-b472-59b46842936a', // Classic Espresso -> Golden Jaggery Velvet (as a default fallback)
  'p002': '165c42ad-1e76-4724-9b16-74d9781ff29a', // Americano -> Cold Brew
  'p003': '3ed8fd79-05df-4e0c-9c3e-d0da3413dcbe', // Oat Milk Latte -> Honey Spiced Latte
  'p004': '3ed8fd79-05df-4e0c-9c3e-d0da3413dcbe', // Honey Latte -> Honey Spiced Latte
  'p005': '3e3390c7-3d82-417b-b472-59b46842936a', // Classic Cappuccino -> Golden Jaggery Velvet
  'p006': '3e3390c7-3d82-417b-b472-59b46842936a', // Cinnamon Dust Cap -> Golden Jaggery Velvet
  'p007': '2081f9b4-842b-4ff7-af4e-341f4ebce608', // Ceremonial Matcha -> Cascara Ice Tea (as a fallback)
  'p008': '2081f9b4-842b-4ff7-af4e-341f4ebce608', // Iced Matcha Latte -> Cascara Ice Tea
  'p009': '165c42ad-1e76-4724-9b16-74d9781ff29a', // Classic Cold Brew -> Cold Brew
  'p010': 'ffc7727e-27ac-41ba-9580-8ad8d0ef95e9', // Oat Cold Brew -> Cold Brew Tonic
  'p011': '42afdd2d-0682-421b-97d6-fbebb56dde61', // Iced Caramel Latte -> Salted Caramel Jaggery
  'p012': '2081f9b4-842b-4ff7-af4e-341f4ebce608', // Cascara Cooler -> Cascara Ice Tea
  'p013': '7745ff4a-6c64-4ad4-8ff8-6f9cf354801a', // RajPresso -> Mint Tonic
  'p014': '39fd286b-6109-402e-8205-7c9684b2b410', // Vandy Mood Mocha -> Ice Mocha
  'p015': 'b1368aee-ee82-4005-b159-9e48a88289e2', // Kishorappe -> Ginger Tonic
  'p016': '59c6f2e7-8f3a-4698-816a-e993b2560a11', // RishiLatte -> Vanilla Shake
};

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
        const backendUuid = PRODUCT_MAPPING[item.id] || '3e3390c7-3d82-417b-b472-59b46842936a'; // default fallback
        
        // Construct detailed notes containing customizations and size
        let notesParts = [`Size: ${item.size === 'small' ? 'Small' : 'Standard'}`];
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
        notes: `Payment Ref: ${paymentRef}${tableNumber ? ` | Table: ${tableNumber}` : ''}`
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
