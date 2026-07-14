import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close modal overlay"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative z-10 w-full overflow-hidden rounded-xl bg-white shadow-2xl ${sizes[size]} max-h-[90vh]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2
            id="modal-title"
            className="text-lg font-bold text-primary"
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="max-h-[calc(90vh-72px)] overflow-y-auto px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;