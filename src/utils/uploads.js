export const ACCEPTED_IMAGE_EXTENSIONS = '.jpg,.jpeg,.png';

const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png']);

export const UPLOAD_BASE_URL =
  import.meta.env.VITE_UPLOAD_BASE_URL || 'https://localhost:7202/uploads';

export function getCandidatePhotoUrl(photo) {
  if (!photo) return null;
  return `${UPLOAD_BASE_URL}/candidates/${photo}`;
}

export function getPartyLogoUrl(logo) {
  if (!logo) return null;
  return `${UPLOAD_BASE_URL}/parties/${logo}`;
}

export function validateImageFile(file) {
  if (!file) {
    return 'Please select an image file.';
  }

  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    return 'Only .jpg, .jpeg, and .png files are allowed.';
  }

  return null;
}
