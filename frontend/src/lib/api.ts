/**
 * Get the API URL based on environment
 * In production, uses Railway backend URL
 * In development, uses localhost:5000 or VITE_API_URL
 */
export function getApiUrl(): string {
  // If explicitly set in environment, use that
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // In production (importai.in), use Railway backend
  const hostname = window.location.hostname;
  if (hostname === 'importai.in' || hostname === 'www.importai.in') {
    return 'https://importai-production-31f3.up.railway.app';
  }

  // In development, use localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }

  // Fallback: use same origin
  return window.location.origin;
}

