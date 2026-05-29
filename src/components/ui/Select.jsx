const Select = ({
  label,
  name,
  options = [],
  error,
  register,
  required = false,
  placeholder,
  className = '',
  ...rest
}) => {
  const inputProps = register ? register(name) : { name };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        className={`
          w-full px-3 py-2 rounded-lg border text-sm text-gray-900 bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-150
          ${error
            ? 'border-red-500 ring-1 ring-red-200 focus:ring-red-400 focus:border-red-400'
            : 'border-gray-300'
          }
          ${className}
        `}
        {...inputProps}
        {...rest}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-600 mt-0.5">{error}</p>
      )}
    </div>
  );
};

export default Select;
