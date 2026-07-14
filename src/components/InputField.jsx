import { forwardRef } from 'react';

const InputField = forwardRef(function InputField(
  {
    id,
    label,
    type = 'text',
    placeholder,
    error,
    icon: Icon,
    helperText,
    className = '',
    containerClassName = '',
    ...props
  },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className={containerClassName}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder={placeholder}
          className={`w-full rounded-lg border py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary/30 ${
            Icon ? 'pl-10 pr-3' : 'px-3'
          } ${
            error
              ? 'border-danger focus:border-danger'
              : 'border-gray-300 focus:border-primary'
          } ${className}`}
          {...props}
        />
      </div>

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      {!error && helperText && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

export default InputField;
