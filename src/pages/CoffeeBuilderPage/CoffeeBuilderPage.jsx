import { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useBuilderStore } from '@/store/useBuilderStore';
import StepProgressBar from '@/components/StepProgressBar/StepProgressBar';
import './CoffeeBuilderPage.css';

const Step1Category = lazy(() => import('./steps/Step1Category'));
const Step2Coffee = lazy(() => import('./steps/Step2Coffee'));
const Step3Milk = lazy(() => import('./steps/Step3Milk'));
const Step4Sweetener = lazy(() => import('./steps/Step4Sweetener'));
const Step5Topping = lazy(() => import('./steps/Step5Topping'));
const Step6Review = lazy(() => import('./steps/Step6Review'));

const STEPS = [Step1Category, Step2Coffee, Step3Milk, Step4Sweetener, Step5Topping, Step6Review];

const stepVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir)  => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }),
};

function StepFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

export default function CoffeeBuilderPage() {
  const { step, direction, goBack, goToStep, image, name } = useBuilderStore();
  const navigate = useNavigate();

  const CurrentStep = STEPS[step - 1];
  const isReviewStep = step === 6;
  const hasDrink = !!image;

  return (
    <div className="builder-page page-wrapper">
      {/* Step Progress Bar — clickable */}
      <div className="builder-page__progress container">
        <StepProgressBar
          currentStep={Math.min(step, 6)}
          maxStep={6}
          onStepClick={(s) => goToStep(s)}
        />
      </div>

      {/* Title row */}
      <div className="builder-page__header container">
        <button className="builder-page__back" onClick={() => step === 1 ? navigate('/menu') : goBack()} aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <div className="builder-page__title-group">
          <h1 className="builder-page__title">Code Your Coffee</h1>
          <p className="builder-page__sub">
            {isReviewStep ? 'Review & Checkout' : `Step ${step} of 5`}
          </p>
        </div>
        {hasDrink ? (
          <img
            src={image}
            alt={name}
            className="builder-page__thumb"
          />
        ) : (
          <div style={{ width: 36 }} />
        )}
      </div>

      {/* Step Content */}
      <div className="builder-page__body container builder-page__body--centered">
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
              <Suspense fallback={<StepFallback />}>
                <CurrentStep />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}