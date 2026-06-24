export default function Button({ children, variant = 'primary', onClick, type = 'button', disabled }) {
  return (
    <button
      className={`button button--${variant}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
