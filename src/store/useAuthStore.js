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

      setPhone: (phone) => set({ phone }),

      sendOTP: async (phone) => {
        try {
          const res = await authService.sendOtp(phone);
          set({ phone, otpSent: true });
          const payload = unwrapObject(res, {});
          const otp = payload.otp || res.otp;
          return { success: true, otp };
        } catch (err) {
          return { success: false, error: err.message };
        }
      },

      verifyOTP: async (otp) => {
        try {
          const mobile = get().phone;
          const res = await authService.verifyOtp(mobile, otp);
          const payload = unwrapObject(res, {});
          const user = payload.user || res.user;
          
          set({
            otpVerified: true,
            isLoggedIn: true,
            userName: user?.name || '',
          });
          return true;
        } catch {
          return false;
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
        });
      },

      resetOTP: () => set({ otpSent: false, otpVerified: false }),
    }),
    { name: 'chilld-auth' }
  )
);
