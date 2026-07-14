import { FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const variants = {
  success: {
    container: 'border-green-200 bg-green-50 text-success',
    icon: FiCheckCircle,
  },
  error: {
    container: 'border-red-200 bg-red-50 text-danger',
    icon: FiAlertCircle,
  },
  info: {
    container: 'border-blue-200 bg-blue-50 text-accent',
    icon: FiInfo,
  },
};

function Alert({ type = 'info', message, onClose }) {
  if (!message) return null;

  const { container, icon: Icon } = variants[type];

  return (
    <div
      className={`mb-4 flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${container}`}
      role="alert"
    >
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 shrink-0" size={18} />
        <span>{message}</span>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold uppercase tracking-wide opacity-70 hover:opacity-100"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}

export default Alert;
