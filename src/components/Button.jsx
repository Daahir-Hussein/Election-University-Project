const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-dark focus:ring-primary/30',
  secondary:
    'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300',
  success:
    'bg-success text-white hover:bg-green-700 focus:ring-success/30',
  danger:
    'bg-danger text-white hover:bg-red-700 focus:ring-danger/30',
  outline:
    'border border-primary bg-white text-primary hover:bg-primary/5 focus:ring-primary/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
};

function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  icon: Icon,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : (
        Icon && <Icon size={size === 'sm' ? 14 : 16} />
      )}
      {children}
    </button>
  );
}

export default Button;
