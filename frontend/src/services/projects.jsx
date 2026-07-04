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
  apiCall("http://localhost:5000/api/projects");

export const fetchDeletedProjects = () => 
  apiCall("http://localhost:5000/api/projects?includeDeleted=true");

export const createProject = (payload) => 
  apiCall("http://localhost:5000/api/projects", "POST", payload);

export const getProject = (id) => 
  apiCall(`http://localhost:5000/api/projects/${id}`);

export const addProjectMember = (id, payload) => 
  apiCall(`http://localhost:5000/api/projects/${id}/members`, "POST", payload);

export const updateProject = (id, payload) => 
  apiCall(`http://localhost:5000/api/projects/${id}`, "PUT", payload);

export const deleteProject = (id) => 
  apiCall(`http://localhost:5000/api/projects/${id}`, "DELETE");

export const restoreProject = (id) => 
  apiCall(`http://localhost:5000/api/projects/${id}/restore`, "PATCH");