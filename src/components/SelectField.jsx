import { forwardRef } from 'react';

const SelectField = forwardRef(function SelectField(
  {
    id,
    label,
    options = [],
    placeholder = 'Select an option',
    error,
    className = '',
    containerClassName = '',
    ...props
  },
  ref
) {
  const selectId = id || props.name;

  return (
    <div className={containerClassName}>
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <select
        ref={ref}
        id={selectId}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary/30 ${
          error
            ? 'border-danger focus:border-danger'
            : 'border-gray-300 focus:border-primary'
        } ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
});

export default SelectField;
