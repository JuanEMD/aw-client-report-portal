import Modal from './Modal';
import Button from './Button';

export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'danger', onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <Modal title={title || 'Confirm'} onClose={onCancel}>
      <div className="modal__body">
        <p className="confirm-modal__message">{message}</p>
      </div>
      <div className="modal__footer">
        <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
        <Button variant={variant} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
