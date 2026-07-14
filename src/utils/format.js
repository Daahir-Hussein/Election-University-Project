export function toInputDate(value) {
  if (!value) return '';
  return String(value).split('T')[0];
}

export function toApiDate(value) {
  if (!value) return null;
  return new Date(value).toISOString();
}

export function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
