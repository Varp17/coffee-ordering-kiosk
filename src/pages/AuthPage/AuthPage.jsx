import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Phone,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Sparkles,
  Heart,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import OTPInput from '@/components/OTPInput/OTPInput';
import Logo from '@/components/Logo/Logo';
import toast from 'react-hot-toast';
import './AuthPage.css';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || sessionStorage.getItem('pre_auth_redirect') || '/';

  const {
    isLoggedIn,
    phone,
    otpSent,
    sendOTP,
    verifyOTP,
    resetOTP,
  } = useAuthStore();

  // Mode: 'login' (Sign In) vs 'register' (Sign Up)
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  // Form Fields
  const [localPhone, setLocalPhone] = useState(phone || '');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [favoriteBrew, setFavoriteBrew] = useState('Classic Cold Brew');

  // Interactivity State for Logo
  const [logoClicks, setLogoClicks] = useState(0);
  const [logoMessage, setLogoMessage] = useState('');
  const [timer, setTimer] = useState(0);

  // Field Touched / Validation States
  const [touched, setTouched] = useState({
    phone: false,
    fullName: false,
    email: false,
  });

  // Validation Rules
  const cleanPhone = localPhone.replace(/\D/g, '');
  const isPhoneValid = /^[6-9]\d{9}$/.test(cleanPhone);
  const isNameValid = fullName.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectPath);
    }
  }, [isLoggedIn, navigate, redirectPath]);

  // Resend Timer Countdown
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle Logo Interactive Click
  const handleLogoClick = () => {
    const nextClicks = logoClicks + 1;
    setLogoClicks(nextClicks);
    const messages = [
      '☕ Fresh Craft Roast Ready!',
      '⚡ 100% Pure Cold Brew Concentrates!',
      '🌟 Welcome to CHILLD Coffee!',
      '🔥 Taste the Bold Elevation!',
      '🎉 You unlocked a VIP Brew Perk!',
    ];
    setLogoMessage(messages[(nextClicks - 1) % messages.length]);
  };

  // Submit Login / Registration Request
  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ phone: true, fullName: true, email: true });

    if (mode === 'login') {
      if (!isPhoneValid) {
        toast.error('Please enter a valid 10-digit mobile number 📱');
        return;
      }
      const res = await sendOTP(cleanPhone, { intent: 'login' });
      if (res.success) {
        setTimer(60);
        if (res.otp) {
          toast.success(`OTP sent successfully! (Demo Code: ${res.otp}) 📩`);
        } else {
          toast.success('OTP sent to your mobile number! 📩');
        }
      } else {
        toast.error(res.error || 'Failed to send OTP.');
      }
    } else {
      // Registration Mode Validation
      if (!isNameValid) {
        toast.error('Please enter your full name (at least 2 characters) 👤');
        return;
      }
      if (!isPhoneValid) {
        toast.error('Please enter a valid 10-digit mobile number 📱');
        return;
      }
      if (email.trim() && !isEmailValid) {
        toast.error('Please enter a valid email address ✉️');
        return;
      }

      const res = await sendOTP(cleanPhone, {
        intent: 'register',
        name: fullName.trim(),
        email: email.trim(),
        favoriteBrew,
      });

      if (res.success) {
        setTimer(60);
        if (res.otp) {
          toast.success(`Registration OTP sent! (Demo Code: ${res.otp}) 📩`);
        } else {
          toast.success('Registration OTP sent successfully! 📩');
        }
      } else {
        toast.error(res.error || 'Registration failed.');
      }
    }
  };

  // Complete OTP Verification
  const handleOTPComplete = async (otpCode) => {
    const res = await verifyOTP(otpCode, {
      name: fullName.trim(),
      email: email.trim(),
      favoriteBrew,
    });
    if (res.success) {
      const userName = res.user?.name || fullName.trim() || 'Coffee Lover';
      toast.success(`Welcome to CHILLD Coffee, ${userName}! 🎉`);
      const targetPath = searchParams.get('redirect') || sessionStorage.getItem('pre_auth_redirect') || '/';
      sessionStorage.removeItem('pre_auth_redirect');
      navigate(targetPath);
    } else {
      toast.error(res.error || 'Invalid OTP. Please check and try again.');
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    const res = await sendOTP(cleanPhone, {
      intent: mode,
      name: fullName.trim(),
      email: email.trim(),
    });
    if (res.success) {
      setTimer(60);
      if (res.otp) {
        toast.success(`OTP resent! (Demo Code: ${res.otp}) 📩`);
      } else {
        toast.success('OTP resent successfully! 📩');
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
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ── INTERACTIVE BRAND LOGO HEADER ── */}
          <div className="auth-card__brand">
            <motion.div
              className="interactive-logo-container"
              whileHover={{ scale: 1.04, rotate: [0, -1, 1, 0] }}
              whileTap={{ scale: 0.96 }}
              onClick={handleLogoClick}
              title="Click CHILLD Coffee logo for interactivity!"
            >
              <div className="logo-svg-wrapper">
                <Logo width="160px" height="auto" color="#1844AB" />
              </div>

              {/* Floating Coffee Steam Particles */}
              <motion.div
                className="steam-particle steam-1"
                animate={{ y: [-2, -12, -2], opacity: [0.3, 0.9, 0.3] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                ☕
              </motion.div>

              {/* Dynamic Roast Badge */}
              <div className="logo-badge-tag">
                <Sparkles size={11} color="#1844AB" />
                <span>Craft Cold Brew</span>
              </div>
            </motion.div>

            {/* Interactive Logo Click Feedback Banner */}
            <AnimatePresence>
              {logoMessage && (
                <motion.div
                  className="logo-interactive-toast"
                  initial={{ opacity: 0, scale: 0.8, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>{logoMessage}</span>
                  {logoClicks > 0 && <span className="click-counter">x{logoClicks}</span>}
                </motion.div>
              )}
            </AnimatePresence>

            <h1 className="brand-title">Chilld Coffee</h1>
            <p className="brand-subtitle">Pure Craft Coffee Platform</p>
          </div>

          {/* ── AUTH STEPS SWITCH ── */}
          <AnimatePresence mode="wait">
            {!otpSent ? (
              <motion.div
                key="input-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="auth-step-form"
              >
                {/* ── MODE SWITCHER TABS ── */}
                <div className="auth-mode-segmented">
                  <button
                    type="button"
                    className={`mode-tab ${mode === 'login' ? 'active' : ''}`}
                    onClick={() => {
                      setMode('login');
                      setTouched({ phone: false, fullName: false, email: false });
                    }}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    className={`mode-tab ${mode === 'register' ? 'active' : ''}`}
                    onClick={() => {
                      setMode('register');
                      setTouched({ phone: false, fullName: false, email: false });
                    }}
                  >
                    Create Account
                  </button>
                </div>

                <div className="auth-step-header">
                  <h2>{mode === 'login' ? 'Welcome Back!' : 'Create New Account'}</h2>
                  <p>
                    {mode === 'login'
                      ? 'Sign in with your mobile number to view orders and craft recipes.'
                      : 'Join CHILLD Coffee to save custom formulations and earn rewards.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="phone-form" noValidate>
                  {/* FULL NAME (REGISTRATION ONLY) */}
                  {mode === 'register' && (
                    <div className="form-group">
                      <label htmlFor="reg-name-input" className="input-label">
                        Full Name <span className="required-star">*</span>
                      </label>
                      <div
                        className={`input-wrapper ${
                          touched.fullName
                            ? isNameValid
                              ? 'is-valid'
                              : 'is-invalid'
                            : ''
                        }`}
                      >
                        <User className="input-icon" size={16} />
                        <input
                          id="reg-name-input"
                          type="text"
                          className="auth-field-input"
                          placeholder="e.g. Alex Morgan"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
                          autoFocus={mode === 'register'}
                        />
                        {touched.fullName && isNameValid && (
                          <CheckCircle2 size={16} className="valid-icon" />
                        )}
                        {touched.fullName && !isNameValid && (
                          <AlertCircle size={16} className="invalid-icon" />
                        )}
                      </div>
                      {touched.fullName && !isNameValid && (
                        <p className="field-error-text">Name must be at least 2 characters long</p>
                      )}
                    </div>
                  )}

                  {/* MOBILE NUMBER (BOTH MODES) */}
                  <div className="form-group">
                    <label htmlFor="mobile-number-input" className="input-label">
                      Mobile Number <span className="required-star">*</span>
                    </label>
                    <div
                      className={`phone-input-wrapper ${
                        touched.phone
                          ? isPhoneValid
                            ? 'is-valid'
                            : 'is-invalid'
                          : ''
                      }`}
                    >
                      <span className="country-code">+91</span>
                      <input
                        id="mobile-number-input"
                        type="tel"
                        className="phone-input"
                        placeholder="98765 43210"
                        value={localPhone}
                        onChange={(e) => setLocalPhone(e.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                        maxLength={10}
                        autoFocus={mode === 'login'}
                      />
                      <Phone className="input-icon" size={16} />
                      {touched.phone && isPhoneValid && (
                        <CheckCircle2 size={16} className="valid-icon" style={{ marginLeft: 6 }} />
                      )}
                    </div>
                    {touched.phone && !isPhoneValid && (
                      <p className="field-error-text">Enter a valid 10-digit Indian mobile number</p>
                    )}
                  </div>

                  {/* EMAIL ADDRESS (OPTIONAL/RECOMMENDED IN REGISTRATION) */}
                  {mode === 'register' && (
                    <div className="form-group">
                      <label htmlFor="reg-email-input" className="input-label">
                        Email Address <span className="optional-tag">(Optional)</span>
                      </label>
                      <div
                        className={`input-wrapper ${
                          email && touched.email
                            ? isEmailValid
                              ? 'is-valid'
                              : 'is-invalid'
                            : ''
                        }`}
                      >
                        <Mail className="input-icon" size={16} />
                        <input
                          id="reg-email-input"
                          type="email"
                          className="auth-field-input"
                          placeholder="alex@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                        />
                        {email && isEmailValid && (
                          <CheckCircle2 size={16} className="valid-icon" />
                        )}
                      </div>
                      {email && touched.email && !isEmailValid && (
                        <p className="field-error-text">Enter a valid email address format</p>
                      )}
                    </div>
                  )}

                  {/* FAVORITE BREW PREFERENCE (REGISTRATION ONLY) */}
                  {mode === 'register' && (
                    <div className="form-group">
                      <label htmlFor="reg-brew-select" className="input-label">
                        Favorite Coffee Style
                      </label>
                      <div className="input-wrapper">
                        <Coffee className="input-icon" size={16} />
                        <select
                          id="reg-brew-select"
                          className="auth-select-input"
                          value={favoriteBrew}
                          onChange={(e) => setFavoriteBrew(e.target.value)}
                        >
                          <option value="Classic Cold Brew">☕ Classic Cold Brew</option>
                          <option value="French Vanilla Cold Brew">🍦 French Vanilla Cold Brew</option>
                          <option value="Hazelnut Cold Brew">🌰 Hazelnut Cold Brew</option>
                          <option value="Dark Roast Concentrate">⚡ Dark Roast Bottled Concentrate</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary auth-submit-btn">
                    {mode === 'login' ? 'Send OTP Code' : 'Register & Send OTP'}
                    <ArrowRight size={16} style={{ marginLeft: 6 }} />
                  </button>
                </form>

                <div className="auth-disclaimer">
                  <Lock size={12} />
                  <span>256-bit SSL encrypted secure login. No password required.</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="auth-step-form"
              >
                {/* ── OTP VERIFICATION STEP ── */}
                <button className="auth-back-btn" onClick={handleBackToPhone} aria-label="Go back">
                  <ArrowLeft size={16} /> Edit number / mode
                </button>

                <div className="auth-step-header">
                  <h2>Verify Mobile OTP</h2>
                  <p>
                    We have sent a 6-digit security code to <strong>+91 {localPhone}</strong>.
                    {fullName && (
                      <span className="registered-name-tag"> Account Name: {fullName}</span>
                    )}
                  </p>
                </div>

                <div className="otp-input-area">
                  <OTPInput length={6} onComplete={handleOTPComplete} />
                  <p className="otp-hint">Enter the 6-digit verification code sent to your device</p>
                </div>

                <div className="otp-resend-area">
                  {timer > 0 ? (
                    <p className="timer-text">
                      Resend code in <strong>{timer}s</strong>
                    </p>
                  ) : (
                    <button className="resend-btn" onClick={handleResend} type="button">
                      <RefreshCw size={14} /> Resend OTP
                    </button>
                  )}
                </div>

                <div className="auth-disclaimer">
                  <ShieldCheck size={12} />
                  <span>Secure 2-Factor OTP Verification.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="auth-card-footer">
            <Link to="/menu" className="guest-browse-link">
              ← Continue as Guest to Store Menu
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
