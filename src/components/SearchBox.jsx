import { FiSearch, FiX } from 'react-icons/fi';

function SearchBox({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  className = '',
}) {
  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={`relative max-w-md ${className}`}>
      <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label="Clear search"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
}

export default SearchBox;
