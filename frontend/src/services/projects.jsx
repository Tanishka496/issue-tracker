import { API_BASE_URL } from './api';

const apiCall = (path, method = 'GET', body = null) =>
  fetch(path, {
    method,
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    },
    body: body ? JSON.stringify(body) : null,
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || "Network error");
    return data;
  });

export const fetchProjects = () => 
  apiCall(`${API_BASE_URL}/projects`);

export const fetchDeletedProjects = () => 
  apiCall(`${API_BASE_URL}/projects?includeDeleted=true`);

export const createProject = (payload) => 
  apiCall(`${API_BASE_URL}/projects`, "POST", payload);

export const getProject = (id) => 
  apiCall(`${API_BASE_URL}/projects/${id}`);

export const addProjectMember = (id, payload) => 
  apiCall(`${API_BASE_URL}/projects/${id}/members`, "POST", payload);

export const updateProject = (id, payload) => 
  apiCall(`${API_BASE_URL}/projects/${id}`, "PUT", payload);

export const deleteProject = (id) => 
  apiCall(`${API_BASE_URL}/projects/${id}`, "DELETE");

export const restoreProject = (id) => 
  apiCall(`${API_BASE_URL}/projects/${id}/restore`, "PATCH");