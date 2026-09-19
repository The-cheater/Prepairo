/**
 * Prepairo API Configuration & Client Helper
 * Supports both local development (http://localhost:5000/api)
 * and production deployment settings (NEXT_PUBLIC_API_URL or relative /api).
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' ? '/api' : 'http://localhost:5000/api');

/**
 * Returns a fully qualified API URL based on environment settings.
 * Handles both '/api/...' and '/...' inputs cleanly without duplicate prefixes.
 */
export function getApiUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
  let endpoint = path.startsWith('/') ? path : `/${path}`;

  // If base already ends with /api and path starts with /api/, avoid /api/api/...
  if (base.endsWith('/api') && endpoint.startsWith('/api/')) {
    endpoint = endpoint.substring(4);
  }

  return `${base}${endpoint}`;
}

export async function fetchApi(endpoint: string, options?: RequestInit) {
  const url = getApiUrl(endpoint);
  const isFormData = typeof FormData !== 'undefined' && options?.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options?.headers as Record<string, string>),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

