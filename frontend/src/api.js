const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export function apiFetch(url, options = {}) {
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  return fetch(fullUrl, {
    ...options,
    credentials: "include",
  });
}
