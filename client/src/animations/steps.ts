import { Variants } from 'framer-motion';

export const steps: Variants = {
  initial: {
    x: '70%',
    scale: 0.8,
    opacity: 0,
  },
  animate: {
    x: '0%',
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut', type: 'tween' },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    scale: 0.6,
    transition: { duration: 0.55, ease: 'easeOut', type: 'tween' },
  },
};
