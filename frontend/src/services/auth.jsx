import { API_BASE_URL } from './api';

const api = (path, body) =>
  fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || "Network error");
    return data;
  });

export const register = (payload) => api(`${API_BASE_URL}/auth/register`, payload);
export const login = (payload) => api(`${API_BASE_URL}/auth/login`, payload);