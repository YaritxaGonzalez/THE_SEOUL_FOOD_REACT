export const API_URL =
  (import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:8080/api/v1';

export const API_ORIGIN = (() => {
  try {
    return new URL(API_URL, window.location.origin).origin;
  } catch {
    return '';
  }
})();