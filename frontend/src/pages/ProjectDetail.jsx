import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, addProjectMember, deleteProject } from '../services/projects';
import { fetchTasks, createTask, deleteTask, editTask, updateTaskStatus, updateTaskAssignee } from '../services/tasks';

const getCurrentUserId = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.id || null;
  } catch {
    return null;
  }
};

export default function ProjectDetail() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [editingTaskId, setEditingTaskId] = useState('');
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUserId = getCurrentUserId();

  const taskStatuses = ['todo', 'in progress', 'done'];

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await getProject(projectId);
      setProject(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const data = await fetchTasks(projectId);
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err.message);
    }
  };

  useEffect(() => {
    loadProject();
    loadTasks();
  }, [projectId]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      alert('Task title required');
      return;
    }

    try {
      await createTask(projectId, {
        title: taskTitle,
        status: 'todo',
        assignedTo: taskAssignee || undefined,
      });
      setTaskTitle('');
      setTaskAssignee('');
      loadTasks();
    } catch (err) {
      alert('Failed to add task: ' + err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;

    try {
      await deleteTask(projectId, taskId);
      loadTasks();
    } catch (err) {
      alert('Failed to delete task: ' + err.message);
    }
  };

  const startEditingTask = (task) => {
    setEditingTaskId(task._id);
    setEditingTaskTitle(task.title);
  };

  const cancelEditingTask = () => {
    setEditingTaskId('');
    setEditingTaskTitle('');
  };

  const handleSaveTaskEdit = async (taskId) => {
    if (!editingTaskTitle.trim()) {
      alert('Task title required');
      return;
    }

    try {
      await editTask(projectId, taskId, { title: editingTaskTitle });
      cancelEditingTask();
      loadTasks();
    } catch (err) {
      alert('Failed to update task: ' + err.message);
    }
  };

  const handleTaskStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(projectId, taskId, status);
      loadTasks();
    } catch (err) {
      alert('Failed to update task status: ' + err.message);
    }
  };

  const handleTaskAssigneeChange = async (taskId, assignedTo) => {
    try {
      await updateTaskAssignee(projectId, taskId, assignedTo || null);
      loadTasks();
    } catch (err) {
      alert('Failed to update task assignee: ' + err.message);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!memberEmail.trim()) {
      alert('Member email required');
      return;
    }

    try {
      await addProjectMember(projectId, { email: memberEmail });
      setMemberEmail('');
      loadProject();
    } catch (err) {
      alert('Failed to add member: ' + err.message);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Soft delete this project? It will be hidden from the home page.')) return;

    try {
      await deleteProject(projectId);
      navigate('/home');
    } catch (err) {
      alert('Failed to delete project: ' + err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!project) return <p>Project not found</p>;

  const groupedTasks = taskStatuses.reduce((acc, status) => {
    acc[status] = tasks.filter(task => (task.status || 'todo') === status);
    return acc;
  }, {});

  return (
    <div style={{ padding: '20px' }}>
      <button
        onClick={() => navigate('/home')}
        style={{ marginBottom: '15px', padding: '8px 15px', backgroundColor: '#6c757d', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
      >
        ← Back
      </button>

      <h1>{project.title || project.name}</h1>
      {project.description && <p>{project.description}</p>}
      {project.createdBy && (
        <p><strong>Created by:</strong> {project.createdBy.name || project.createdBy.email}</p>
      )}
      {Array.isArray(project.members) && project.members.length > 0 && (
        <p><strong>Members:</strong> {project.members.map(member => member.name || member.email).join(', ')}</p>
      )}

      {project.createdBy && project.createdBy._id === currentUserId && (
        <button
          type="button"
          onClick={handleDeleteProject}
          style={{ marginBottom: '20px', padding: '8px 15px', backgroundColor: '#b91c1c', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
        >
          Soft Delete Project
        </button>
      )}

      <form onSubmit={handleAddMember} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <input
          value={memberEmail}
          onChange={(e) => setMemberEmail(e.target.value)}
          placeholder="Add project member by email"
          style={{ marginRight: '10px', padding: '5px', width: '70%' }}
        />
        <button type="submit" style={{ padding: '5px 15px' }}>Add Member</button>
      </form>

      <h2>Tasks</h2>

      <form onSubmit={handleAddTask} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <input
          value={taskTitle}
          onChange={e => setTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          required
          style={{ marginRight: '10px', padding: '5px', width: '70%' }}
        />
        <select
          value={taskAssignee}
          onChange={e => setTaskAssignee(e.target.value)}
          style={{ marginRight: '10px', padding: '5px', minWidth: '220px' }}
        >
          <option value="">Assign to member</option>
          {Array.isArray(project.members) && project.members.map(member => (
            <option key={member._id} value={member._id}>
              {member.name || member.email}
            </option>
          ))}
        </select>
        <button type="submit" style={{ padding: '5px 15px' }}>Add Task</button>
      </form>

      {tasks.length === 0 ? (
        <p>No tasks yet. Create one above!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {taskStatuses.map(status => (
            <section key={status} style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '12px' }}>
              <h3 style={{ marginTop: 0, textTransform: 'capitalize' }}>{status}</h3>
              {groupedTasks[status].length === 0 ? (
                <p style={{ color: '#666' }}>No tasks</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {groupedTasks[status].map(task => (
                    <li
                      key={task._id}
                      style={{
                        marginBottom: '10px',
                        padding: '10px',
                        border: '1px solid #eee',
                        borderRadius: '4px'
                      }}
                    >
                      <div style={{ marginBottom: '10px' }}>
                        {editingTaskId === task._id ? (
                          <input
                            value={editingTaskTitle}
                            onChange={(e) => setEditingTaskTitle(e.target.value)}
                            style={{ width: '100%', padding: '6px' }}
                          />
                        ) : (
                          <strong>{task.title}</strong>
                        )}
                        <small style={{ display: 'block', color: '#666' }}>{new Date(task.createdAt).toLocaleDateString()}</small>
                        <small style={{ display: 'block', color: '#666' }}>
                          Created by: {task.createdBy ? task.createdBy.name : 'Unknown'}
                        </small>
                        <small style={{ display: 'block', color: '#666' }}>
                          Assigned to: {task.assignedTo ? (task.assignedTo.name || task.assignedTo.email) : 'Unassigned'}
                        </small>
                      </div>
                      <label style={{ display: 'block', marginBottom: '8px' }}>
                        Status
                        <select
                          value={task.status || 'todo'}
                          onChange={(e) => handleTaskStatusChange(task._id, e.target.value)}
                          style={{ display: 'block', marginTop: '4px', width: '100%', padding: '6px' }}
                        >
                          <option value="todo">todo</option>
                          <option value="in progress">in progress</option>
                          <option value="done">done</option>
                        </select>
                      </label>
                      <label style={{ display: 'block', marginBottom: '8px' }}>
                        Assigned to
                        <select
                          value={task.assignedTo?._id || task.assignedTo || ''}
                          onChange={(e) => handleTaskAssigneeChange(task._id, e.target.value)}
                          style={{ display: 'block', marginTop: '4px', width: '100%', padding: '6px' }}
                        >
                          <option value="">Unassigned</option>
                          {Array.isArray(project.members) && project.members.map(member => (
                            <option key={member._id} value={member._id}>
                              {member.name || member.email}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleDeleteTask(task._id)}
                        style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                      >
                        Delete
                      </button>
                      {editingTaskId === task._id ? (
                        <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleSaveTaskEdit(task._id)}
                            style={{ padding: '5px 10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditingTask}
                            style={{ padding: '5px 10px', backgroundColor: '#6b7280', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEditingTask(task)}
                          style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: '#0f766e', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                        >
                          Edit
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}