import { API_BASE_URL } from './api';

const apiCall = (path) =>
  fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || 'Network error');
    return data;
  });

export const fetchActivities = (projectId) =>
  apiCall(`${API_BASE_URL}/projects/${projectId}/activities`);
