import './StepProgressBar.css';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const STEP_LABELS = ['Concentrate', 'Sweetener', 'Milk', 'Topping', 'Review'];

export default function StepProgressBar({ currentStep, maxStep = 5 }) {
  return (
    <div className="step-progress" role="progressbar" aria-valuenow={currentStep} aria-valuemax={maxStep}>
      {STEP_LABELS.map((label, idx) => {
        const step = idx + 1;
        const isDone   = step < currentStep;
        const isActive = step === currentStep;

        return (
          <div key={step} className="step-progress__item">
            {/* Dot */}
            <motion.div
              className={`step-progress__dot ${isActive ? 'dot--active' : ''} ${isDone ? 'dot--done' : ''}`}
              animate={isActive ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
            >
              {isDone ? <Check size={12} strokeWidth={3} /> : step}
            </motion.div>

            {/* Label */}
            <span className={`step-progress__label ${isActive ? 'label--active' : ''} ${isDone ? 'label--done' : ''}`}>
              {label}
            </span>

            {/* Connector */}
            {idx < maxStep - 1 && (
              <div className="step-progress__connector">
                <motion.div
                  className="step-progress__connector-fill"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isDone ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
