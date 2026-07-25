import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth';
import { unwrapObject } from '../utils/apiResponse';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn:  false,
      phone:       '',
      userName:    '',
      otpSent:     false,
      otpVerified: false,
      authIntent:  'login',

      setPhone: (phone) => set({ phone }),

      sendOTP: async (phone, options = {}) => {
        try {
          const res = await authService.sendOtp({ mobile: phone, ...options });
          set({ phone, otpSent: true, authIntent: options.intent || 'login' });
          const payload = unwrapObject(res, {});
          const otp = payload.otp || res.otp;
          return { success: true, otp };
        } catch (err) {
          return { success: false, error: err.message };
        }
      },

      verifyOTP: async (otp, details = {}) => {
        try {
          const mobile = get().phone;
          const res = await authService.verifyOtp(mobile, otp, {
            intent: get().authIntent,
            ...details,
          });
          const payload = unwrapObject(res, {});
          const user = payload.user || res.user;

          set({
            otpVerified: true,
            isLoggedIn: true,
            userName: user?.name || details.name || details.fullName || '',
          });
          return { success: true, user: user || { name: details.name || details.fullName } };
        } catch (err) {
          return { success: false, error: err.message };
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch {
          /* ignore logout failures */
        }
        set({
          isLoggedIn:  false,
          phone:       '',
          userName:    '',
          otpSent:     false,
          otpVerified: false,
          authIntent:  'login',
        });
      },

      resetOTP: () => set({ otpSent: false, otpVerified: false, authIntent: 'login' }),
    }),
    { name: 'chilld-auth' }
  )
);
