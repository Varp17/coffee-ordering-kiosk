import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion as motionFramer, AnimatePresence as AnimatePresenceFramer } from 'framer-motion';
import { Lock, Phone, ArrowLeft, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import OTPInput from '@/components/OTPInput/OTPInput';
import toast from 'react-hot-toast';
import './AuthPage.css';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/checkout';

  const {
    isLoggedIn,
    phone,
    otpSent,
    setPhone,
    sendOTP,
    verifyOTP,
    resetOTP,
  } = useAuthStore();

  const [localPhone, setLocalPhone] = useState(phone || '');
  const [timer, setTimer] = useState(0);

  // If already logged in, redirect immediately
  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectPath);
    }
  }, [isLoggedIn, navigate, redirectPath]);

  // Countdown timer for resending OTP
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    const cleanPhone = localPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number 📱');
      return;
    }

    const res = await sendOTP(cleanPhone);
    if (res.success) {
      setTimer(60);
      if (res.otp) {
        toast.success(`OTP sent successfully! (Code: ${res.otp}) 📩`);
      } else {
        toast.success('OTP sent successfully! 📩');
      }
    } else {
      toast.error(res.error || 'Failed to send OTP.');
    }
  };

  const handleOTPComplete = async (otpCode) => {
    const success = await verifyOTP(otpCode);
    if (success) {
      toast.success('Login successful! Welcome back 🎉');
      navigate(redirectPath);
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    const cleanPhone = localPhone.replace(/\D/g, '');
    const res = await sendOTP(cleanPhone);
    if (res.success) {
      setTimer(60);
      if (res.otp) {
        toast.success(`OTP resent! (Code: ${res.otp}) 📩`);
      } else {
        toast.success('OTP resent! 📩');
      }
    } else {
      toast.error(res.error || 'Failed to resend OTP.');
    }
  };

  const handleBackToPhone = () => {
    resetOTP();
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="container auth-container">
        <motionFramer
          className="auth-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo or brand header */}
          <div className="auth-card__brand">
            <span className="brand-emoji">☕</span>
            <h1 className="brand-title">Chilld Coffee</h1>
            <p className="brand-subtitle">Pure Craft Coffee Platform</p>
          </div>

          <AnimatePresenceFramer mode="wait">
            {!otpSent ? (
              <motionFramer
                key="phone-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="auth-step-form"
              >
                <div className="auth-step-header">
                  <h2>Enter Contact Number</h2>
                  <p>Login or create an account with your mobile number.</p>
                </div>

                <form onSubmit={handleSendOTP} className="phone-form">
                  <div className="phone-input-wrapper">
                    <span className="country-code">+91</span>
                    <input
                      id="mobile-number-input"
                      type="tel"
                      className="phone-input"
                      placeholder="98765 43210"
                      value={localPhone}
                      onChange={(e) => setLocalPhone(e.target.value)}
                      maxLength={12}
                      autoFocus
                    />
                    <Phone className="input-icon" size={16} />
                  </div>

                  <button type="submit" className="btn btn-primary auth-submit-btn">
                    Send OTP <ArrowRight size={16} style={{ marginLeft: 6 }} />
                  </button>
                </form>

                <div className="auth-disclaimer">
                  <Lock size={12} />
                  <span>Your connection is secure and encrypted.</span>
                </div>
              </motionFramer>
            ) : (
              <motionFramer
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="auth-step-form"
              >
                <button className="auth-back-btn" onClick={handleBackToPhone} aria-label="Go back">
                  <ArrowLeft size={16} /> Edit number
                </button>

                <div className="auth-step-header">
                  <h2>Verify OTP</h2>
                  <p>We've sent a 6-digit OTP code to +91 {localPhone}.</p>
                </div>

                <div className="otp-input-area">
                  <OTPInput length={6} onComplete={handleOTPComplete} />
                  <p className="otp-hint">Enter the 6-digit verification code sent to your mobile number</p>
                </div>

                <div className="otp-resend-area">
                  {timer > 0 ? (
                    <p className="timer-text">Resend code in <strong>{timer}s</strong></p>
                  ) : (
                    <button className="resend-btn" onClick={handleResend} type="button">
                      <RefreshCw size={14} /> Resend OTP
                    </button>
                  )}
                </div>

                <div className="auth-disclaimer">
                  <ShieldCheck size={12} />
                  <span>Secure 2-factor OTP verification.</span>
                </div>
              </motionFramer>
            )}
          </AnimatePresenceFramer>
        </motionFramer>
      </div>
    </div>
  );
}
