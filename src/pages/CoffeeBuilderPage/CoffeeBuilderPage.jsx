import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useBuilderStore } from '@/store/useBuilderStore';
import StepProgressBar from '@/components/StepProgressBar/StepProgressBar';
import Step1Concentrate from './steps/Step1Concentrate';
import Step2Sweetener   from './steps/Step2Sweetener';
import Step3Milk        from './steps/Step3Milk';
import Step4Topping     from './steps/Step4Topping';
import Step5NameReview  from './steps/Step5NameReview';
import './CoffeeBuilderPage.css';

const STEPS = [Step1Concentrate, Step2Sweetener, Step3Milk, Step4Topping, Step5NameReview];

const stepVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir)  => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }),
};

export default function CoffeeBuilderPage() {
  const { step, direction, goNext, goBack, concentrate, sweetener, milk, topping } = useBuilderStore();
  const navigate = useNavigate();

  const CurrentStep = STEPS[step - 1];

  const canProceed = () => {
    if (step === 1) return !!concentrate;
    if (step === 2) return !!sweetener;
    if (step === 3) return !!milk;
    if (step === 4) return !!topping;
    return true;
  };

  return (
    <div className="builder-page page-wrapper">
      {/* Header */}
      <div className="builder-page__header container">
        <button className="builder-page__back" onClick={() => step === 1 ? navigate('/menu') : goBack()} aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <div className="builder-page__title-group">
          <h1 className="builder-page__title">Code Your Coffee</h1>
          <p className="builder-page__sub">Step {step} of 5</p>
        </div>
        <div style={{ width: 36 }} />
      </div>

      {/* Progress */}
      <div className="container">
        <StepProgressBar currentStep={step} />
      </div>

      {/* Centered wide steps */}
      <div className="builder-page__body container builder-page__body--centered">
        {/* Step content */}
        <div className="builder-page__step-area builder-page__step-area--wide">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="builder-page__step"
            >
              <CurrentStep />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      {step < 5 && (
        <div className="builder-page__nav container">
          <button className="builder-page__nav-back" onClick={goBack} disabled={step === 1}>
            <ArrowLeft size={16} /> Back
          </button>
          <button
            className={`builder-page__nav-next ${canProceed() ? '' : 'disabled'}`}
            onClick={goNext}
            disabled={!canProceed()}
          >
            Next <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
