import Spinner from './Spinner';

const variantClasses = {
  primary:   'bg-blue-600 hover:bg-blue-700 text-white border-transparent',
  secondary: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300',
  danger:    'bg-red-600 hover:bg-red-700 text-white border-transparent',
  ghost:     'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-lg border transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...rest}
    >
      {isLoading && <Spinner size="sm" color="text-current" />}
      {children}
    </button>
  );
};

export default Button;
