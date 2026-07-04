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

export const fetchTasks = (projectId) => 
  apiCall(`http://localhost:5000/api/projects/${projectId}/tasks`);

export const createTask = (projectId, payload) => 
  apiCall(`http://localhost:5000/api/projects/${projectId}/tasks`, "POST", payload);

export const editTask = (projectId, taskId, payload) => 
  apiCall(`http://localhost:5000/api/projects/${projectId}/tasks/${taskId}`, "PATCH", payload);

export const updateTaskStatus = (projectId, taskId, status) => 
  apiCall(`http://localhost:5000/api/projects/${projectId}/tasks/${taskId}/status`, "PATCH", { status });

export const updateTaskAssignee = (projectId, taskId, assignedTo) => 
  apiCall(`http://localhost:5000/api/projects/${projectId}/tasks/${taskId}/assignee`, "PATCH", { assignedTo });

export const deleteTask = (projectId, taskId) => 
  apiCall(`http://localhost:5000/api/projects/${projectId}/tasks/${taskId}`, "DELETE");