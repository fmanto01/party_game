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
        <h5>Confirm Exit</h5>
        <p>Are you sure you want to leave the lobby?</p>
        <div className="button-group">
          <button className="btn btn-leave" onClick={onConfirm}>
            Yes, leave
          </button>
          <button className="btn btn-stay" onClick={onCancel}>
            No, stay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
