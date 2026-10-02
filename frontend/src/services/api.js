const defaultApiUrl = import.meta.env.PROD
	? 'https://taskforge-5mwp.onrender.com/api'
	: 'http://localhost:5000/api';
const configuredApiUrl = import.meta.env.VITE_API_URL || defaultApiUrl;

export const API_BASE_URL = configuredApiUrl.replace(/\/$/, '');