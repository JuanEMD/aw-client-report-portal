export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal__overlay" onClick={onClose}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
