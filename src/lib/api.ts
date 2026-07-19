const API_BASE = import.meta.env.VITE_API_URL || '';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  // ensure we don't have double /api/api
  let url = endpoint;
  if (API_BASE) {
    // If API_BASE is /api and endpoint is /api/..., strip the first /api from endpoint or just prepend smartly
    if (endpoint.startsWith('/api/') && API_BASE === '/api') {
      url = endpoint; // because we're already fetching /api/...
    } else {
      url = `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    }
  }

  const config = {
    ...options,
    credentials: 'include' as RequestCredentials
  };
  return fetch(url, config);
};
