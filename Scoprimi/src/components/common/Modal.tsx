import React from 'react';

interface ModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({ show, onConfirm, onCancel }) => {
  if (!show) { return null; }

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-content-custom">
        <h5>Vuoi lasciare la lobby?</h5>
        <div className="button-group">
          <button className="my-btn my-bg-error" onClick={onConfirm}>
            Si, lascia
          </button>
          <button className="my-btn my-bg-success" onClick={onCancel}>
            No, rimani
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
