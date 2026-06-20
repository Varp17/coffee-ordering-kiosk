import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './OTPInput.css';

export default function OTPInput({ length = 6, onComplete }) {
  const [values, setValues] = useState(Array(length).fill(''));
  const inputs = useRef([]);

  const handleChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const newVals = [...values];
    newVals[idx] = val.slice(-1);
    setValues(newVals);

    // Auto-advance focus
    if (val && idx < length - 1) {
      inputs.current[idx + 1]?.focus();
    }

    // Fire onComplete when all filled
    const full = newVals.join('');
    if (full.length === length && !newVals.includes('')) {
      onComplete?.(full);
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (!values[idx] && idx > 0) {
        inputs.current[idx - 1]?.focus();
      }
    }
    if (e.key === 'ArrowLeft' && idx > 0)         inputs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < length - 1) inputs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const newVals = [...values];
    pasted.split('').forEach((ch, i) => { newVals[i] = ch; });
    setValues(newVals);
    if (pasted.length === length) onComplete?.(pasted);
    inputs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="otp-input" role="group" aria-label="OTP input">
      {values.map((val, idx) => (
        <motion.input
          key={idx}
          id={`otp-input-${idx}`}
          ref={(el) => (inputs.current[idx] = el)}
          className={`otp-input__cell ${val ? 'otp-input__cell--filled' : ''}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          onChange={(e) => handleChange(e.target.value, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          autoFocus={idx === 0}
          aria-label={`Digit ${idx + 1}`}
          whileFocus={{ scale: 1.05, borderColor: 'var(--color-primary)' }}
        />
      ))}
    </div>
  );
}
