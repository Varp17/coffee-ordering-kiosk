// =====================================================
// CHILLD COFFEE — Framer Motion Shared Variants
// =====================================================

// Page-level slide transition
export const pageVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -10, filter: 'blur(2px)', transition: { duration: 0.25, ease: 'easeIn' } },
};

// Staggered container
export const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

// Fade + slide up child item
export const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

// Card hover state
export const cardHover = {
  rest: { scale: 1, y: 0, boxShadow: '0 4px 12px rgba(31,42,68,0.10)' },
  hover: { scale: 1.02, y: -4, boxShadow: '0 16px 40px rgba(31,42,68,0.15)', transition: { duration: 0.25, ease: 'easeOut' } },
};

// Slide in from right (builder steps)
export const slideRight = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:    { x: '-100%', opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } },
};

// Slide in from left
export const slideLeft = {
  initial: { x: '-100%', opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:    { x: '100%', opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } },
};

// Scale pop (for ingredient card selection)
export const selectPop = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  exit:    { scale: 0.8, opacity: 0 },
};

// Drawer slide in from right
export const drawerVariants = {
  closed: { x: '100%', opacity: 0 },
  open:   { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 280, damping: 30 } },
};

// Modal appear
export const modalVariants = {
  hidden:  { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit:    { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
};

// Toast / notification
export const toastVariants = {
  initial: { opacity: 0, y: -16, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit:    { opacity: 0, scale: 0.9, y: -8 },
};

// Confetti particle
export const confettiVariants = {
  initial: { opacity: 1, y: 0, rotate: 0 },
  animate: (i) => ({
    opacity: 0,
    y: window.innerHeight * 1.2,
    rotate: Math.random() * 720 - 360,
    x: (Math.random() - 0.5) * 400,
    transition: {
      duration: 2 + Math.random() * 1.5,
      delay: i * 0.05,
      ease: 'easeIn',
    },
  }),
};

// Number counter (token display)
export const tokenVariants = {
  hidden:  { scale: 0, rotateY: 90, opacity: 0 },
  visible: {
    scale: 1, rotateY: 0, opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20, delay: 0.3 },
  },
};

// Hero word-by-word entrance
export function wordVariants(i) {
  return {
    hidden: { y: '110%', opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
    },
  };
}

// Stagger list for menu items
export const listVariants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export const listItemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  show:   { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};
