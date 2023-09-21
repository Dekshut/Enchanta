import { motion } from 'framer-motion';
import React, { ReactNode, ReactPortal } from 'react';
import { createPortal } from 'react-dom';
import { modal } from '../../../animations';
import './ModalWrapper.scss';

interface ModalWrapperProps {
  children: ReactNode;
}

function ModalWrapper({
  children,
}: ModalWrapperProps): ReactPortal {
  let modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  }

  return (
    createPortal(
      <motion.div
        className="modal"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={modal}
      >
        <div className="modal__inner">
          {children}
        </div>
      </motion.div>,
      modalRoot)
  );
}

export default ModalWrapper;
