import { Variants } from 'framer-motion';

export const modal: Variants = {
  initial: {
    y: '-100%',
    scale: 0.9,
    opacity: 0.5,
  },
  animate: {
    y: '0%',
    scale: 1,
    opacity: 1,
    transition: { duration: 0.45, ease: 'easeOut', type: 'tween' }
  },
  exit: {
    y: '-100%',
    scale: 0.9,
    opacity: 0.5,
    transition: { duration: 0.4, ease: 'easeOut', type: 'tween' }
  },
};

export const smallModal: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { delay: 0.2, duration: 0.45, ease: 'easeOut', type: 'tween' }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.4, ease: 'easeOut', type: 'tween' }
  },
};

export const smallModalInner: Variants = {
  initial: {
    y: '-150%',
    x: '-50%',
    scale: 0.9,
    opacity: 0.5,
  },
  animate: {
    y: '-50%',
    x: '-50%',
    scale: 1,
    opacity: 1,
    transition: { duration: 0.45, ease: 'easeOut', type: 'tween' }
  },
  exit: {
    y: '-150%',
    x: '-50%',
    scale: 0.9,
    opacity: 0.5,
    transition: { duration: 0.4, ease: 'easeOut', type: 'tween' }
  },
};

export const bunner: Variants = {
  initial: {
    y: '-100%',
    opacity: 0.5,
  },
  animate: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut', type: 'tween' }
  },
  exit: {
    y: '-100%',
    opacity: 0.5,
    transition: { duration: 0.4, ease: 'easeOut', type: 'tween' }
  },
};
