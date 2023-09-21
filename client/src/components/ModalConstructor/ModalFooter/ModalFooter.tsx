import React, { ReactNode } from 'react';
import './ModalFooter.scss';

interface ModalFooterProps {
  children: ReactNode;
}

function ModalFooter({ children }: ModalFooterProps) {
  return (
    <div className="modal-footer">
      <div className="modal-footer__inner">
        {children}
      </div>
    </div>
  );
}

export default ModalFooter;
