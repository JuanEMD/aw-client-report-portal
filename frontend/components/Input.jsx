export default function Input({ label, name, type = 'text', register, error, ...props }) {
  return (
    <div className="input-group">
      {label && <label className="input-group__label" htmlFor={name}>{label}</label>}
      <input
        className={`input-group__input${error ? ' input-group__input--error' : ''}`}
        id={name}
        type={type}
        {...register?.(name)}
        {...props}
      />
      {error && <span className="input-group__error">{error.message}</span>}
    </div>
  );
}
