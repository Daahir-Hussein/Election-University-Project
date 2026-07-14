export const nationalIdRules = {
  required: 'National ID is required.',
  pattern: {
    value: /^[0-9]{5,20}$/,
    message: 'National ID must contain 5 to 20 digits.',
  },
};

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const phonePattern = /^[0-9+\-\s()]{7,15}$/;

export const emailRules = {
  required: 'Email is required.',
  pattern: {
    value: emailPattern,
    message: 'Enter a valid email address.',
  },
};

export const phoneRules = {
  required: 'Phone number is required.',
  pattern: {
    value: phonePattern,
    message: 'Enter a valid phone number.',
  },
};

export const requiredRule = (label) => ({
  required: `${label} is required.`,
});

export function getTodayInputDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const startDateRules = {
  required: 'Start date is required.',
  validate: (value) =>
    !value ||
    value >= getTodayInputDate() ||
    'Start date cannot be in the past.',
};

export const createEndDateRules = (startDate) => ({
  required: 'End date is required.',
  validate: (value) =>
    !value ||
    !startDate ||
    value >= startDate ||
    'End date must be on or after start date.',
});
