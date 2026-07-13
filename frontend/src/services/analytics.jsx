import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/analytics';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchStatusAnalytics = () => client.get('/status').then((res) => res.data);
export const fetchPriorityAnalytics = () => client.get('/priority').then((res) => res.data);
export const fetchAssigneeAnalytics = () => client.get('/assignee').then((res) => res.data);
export const fetchResolutionTime = () => client.get('/resolution-time').then((res) => res.data);
