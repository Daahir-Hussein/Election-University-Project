function LoadingSpinner({ label = 'Loading...', size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`animate-spin rounded-full border-primary border-r-transparent ${sizes[size]}`}
        role="status"
        aria-label={label}
      />
      {label && <p className="text-sm text-gray-600">{label}</p>}
    </div>
  );
}

export default LoadingSpinner;
