import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, addProjectMember, deleteProject } from '../services/projects';
import { fetchTasks, createTask, deleteTask, editTask, updateTaskStatus, updateTaskAssignee } from '../services/tasks';

const styles = {
  page: {
    minHeight: '100vh',
    padding: '28px',
    background: 'radial-gradient(circle at top left, rgba(15, 23, 42, 0.06), transparent 30%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
    color: '#0f172a',
  },
  shell: {
    maxWidth: '1280px',
    margin: '0 auto',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '18px',
    flexWrap: 'wrap',
  },
  backButton: {
    padding: '10px 14px',
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    background: '#fff',
    color: '#0f172a',
    cursor: 'pointer',
    fontWeight: 700,
  },
  deleteProjectButton: {
    padding: '10px 14px',
    borderRadius: '14px',
    border: 'none',
    cursor: 'pointer',
    background: '#dc2626',
    color: '#fff',
    fontWeight: 700,
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: '1.3fr 0.7fr',
    gap: '16px',
    marginBottom: '18px',
  },
  heroCard: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    color: '#e2e8f0',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)',
  },
  overviewCard: {
    background: '#fff',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
  },
  title: {
    margin: 0,
    fontSize: '34px',
    lineHeight: 1.06,
    letterSpacing: '-0.04em',
    color: '#fff',
  },
  subtitle: {
    marginTop: '12px',
    color: '#cbd5e1',
    lineHeight: 1.7,
  },
  chipRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '18px',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '7px 11px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
    background: 'rgba(255,255,255,0.12)',
    color: '#fff',
  },
  overviewTitle: {
    margin: '0 0 12px',
    fontSize: '18px',
    color: '#0f172a',
  },
  overviewText: {
    margin: 0,
    color: '#475569',
    lineHeight: 1.7,
  },
  section: {
    background: 'rgba(255,255,255,0.84)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '24px',
    padding: '20px',
    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
    marginTop: '18px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '14px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '22px',
    color: '#0f172a',
  },
  sectionNote: {
    color: '#64748b',
    marginTop: '6px',
  },
  formGrid: {
    display: 'grid',
    gap: '10px',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 14px',
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    background: '#fff',
    color: '#0f172a',
    outline: 'none',
  },
  blueButton: {
    padding: '12px 16px',
    borderRadius: '14px',
    border: 'none',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    color: '#fff',
    fontWeight: 700,
    boxShadow: '0 12px 24px rgba(37, 99, 235, 0.25)',
  },
  neutralButton: {
    padding: '12px 16px',
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    cursor: 'pointer',
    background: '#fff',
    color: '#0f172a',
    fontWeight: 700,
  },
  dangerButton: {
    padding: '12px 16px',
    borderRadius: '14px',
    border: 'none',
    cursor: 'pointer',
    background: '#dc2626',
    color: '#fff',
    fontWeight: 700,
  },
  mutedButton: {
    padding: '12px 16px',
    borderRadius: '14px',
    border: 'none',
    cursor: 'pointer',
    background: '#475569',
    color: '#fff',
    fontWeight: 700,
  },
  taskBoard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '14px',
  },
  lane: {
    background: '#fff',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '20px',
    padding: '14px',
  },
  laneTitle: {
    margin: '0 0 10px',
    fontSize: '16px',
    textTransform: 'capitalize',
    color: '#0f172a',
  },
  taskCard: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '14px',
    boxShadow: '0 10px 20px rgba(15, 23, 42, 0.05)',
  },
  badgeRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '10px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
  },
  badgeBlue: {
    background: '#dbeafe',
    color: '#1d4ed8',
  },
  badgeGreen: {
    background: '#dcfce7',
    color: '#166534',
  },
  badgeYellow: {
    background: '#fef3c7',
    color: '#92400e',
  },
  badgeGray: {
    background: '#f1f5f9',
    color: '#475569',
  },
  taskButtonRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '10px',
  },
  statusSelect: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    background: '#fff',
    color: '#0f172a',
  },
  error: {
    padding: '10px 12px',
    borderRadius: '12px',
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca',
    marginBottom: '16px',
  },
};

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
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.topBar}>
          <button onClick={() => navigate('/home')} style={styles.backButton}>← Back to projects</button>
          {project.createdBy && project.createdBy._id === currentUserId && (
            <button type="button" onClick={handleDeleteProject} style={styles.deleteProjectButton}>
              Soft Delete Project
            </button>
          )}
        </div>

        <div style={styles.hero}>
          <section style={styles.heroCard}>
            <h1 style={styles.title}>{project.title || project.name}</h1>
            <p style={styles.subtitle}>
              Manage work in a structured board. Track task status, assignment, creator, and progress from one place.
            </p>

            <div style={styles.chipRow}>
              <span style={styles.chip}>Task board</span>
              <span style={styles.chip}>Members only</span>
              <span style={styles.chip}>Editable tasks</span>
            </div>
          </section>

          <aside style={styles.overviewCard}>
            <h2 style={styles.overviewTitle}>Project overview</h2>
            <p style={styles.overviewText}><strong>Description:</strong> {project.description || 'No description added.'}</p>
            <p style={{ ...styles.overviewText, marginTop: '10px' }}>
              <strong>Created by:</strong> {project.createdBy ? (project.createdBy.name || project.createdBy.email) : 'Unknown'}
            </p>
            <p style={{ ...styles.overviewText, marginTop: '10px' }}>
              <strong>Members:</strong> {Array.isArray(project.members) && project.members.length > 0 ? project.members.map(member => member.name || member.email).join(', ') : 'No members yet'}
            </p>
          </aside>
        </div>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Add member</h2>
              <p style={styles.sectionNote}>Invite an existing user by email.</p>
            </div>
          </div>

          <form onSubmit={handleAddMember} style={styles.formGrid}>
            <input
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              placeholder="Add project member by email"
              style={styles.input}
            />
            <button type="submit" style={styles.blueButton}>Add Member</button>
          </form>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Create task</h2>
              <p style={styles.sectionNote}>Assign work right away and keep it moving through the board.</p>
            </div>
          </div>

          <form onSubmit={handleAddTask} style={{ display: 'grid', gap: '10px' }}>
            <input
              value={taskTitle}
              onChange={e => setTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              required
              style={styles.input}
            />
            <select
              value={taskAssignee}
              onChange={e => setTaskAssignee(e.target.value)}
              style={styles.input}
            >
              <option value="">Assign to member</option>
              {Array.isArray(project.members) && project.members.map(member => (
                <option key={member._id} value={member._id}>
                  {member.name || member.email}
                </option>
              ))}
            </select>
            <button type="submit" style={styles.blueButton}>Add Task</button>
          </form>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Tasks</h2>
              <p style={styles.sectionNote}>Grouped by status for a cleaner workflow.</p>
            </div>
          </div>

          {tasks.length === 0 ? (
            <div style={{ padding: '20px 8px', color: '#64748b' }}>No tasks yet. Create one above!</div>
          ) : (
            <div style={styles.taskBoard}>
              {taskStatuses.map(status => (
                <section key={status} style={styles.lane}>
                  <h3 style={styles.laneTitle}>{status}</h3>
                  {groupedTasks[status].length === 0 ? (
                    <p style={{ color: '#64748b', margin: 0 }}>No tasks</p>
                  ) : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {groupedTasks[status].map(task => (
                        <article key={task._id} style={styles.taskCard}>
                          <div style={{ marginBottom: '12px' }}>
                            {editingTaskId === task._id ? (
                              <input
                                value={editingTaskTitle}
                                onChange={(e) => setEditingTaskTitle(e.target.value)}
                                style={styles.input}
                              />
                            ) : (
                              <h4 style={{ margin: '0 0 8px', fontSize: '18px', color: '#0f172a' }}>{task.title}</h4>
                            )}

                            <div style={styles.badgeRow}>
                              <span style={{ ...styles.badge, ...styles.badgeBlue }}>
                                {new Date(task.createdAt).toLocaleDateString()}
                              </span>
                              <span style={{ ...styles.badge, ...styles.badgeGreen }}>
                                Created by: {task.createdBy ? task.createdBy.name : 'Unknown'}
                              </span>
                              <span style={{ ...styles.badge, ...styles.badgeYellow }}>
                                Assigned to: {task.assignedTo ? (task.assignedTo.name || task.assignedTo.email) : 'Unassigned'}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gap: '10px' }}>
                            <label style={{ display: 'grid', gap: '6px', color: '#334155', fontSize: '14px', fontWeight: 600 }}>
                              Status
                              <select
                                value={task.status || 'todo'}
                                onChange={(e) => handleTaskStatusChange(task._id, e.target.value)}
                                style={styles.statusSelect}
                              >
                                <option value="todo">todo</option>
                                <option value="in progress">in progress</option>
                                <option value="done">done</option>
                              </select>
                            </label>

                            <label style={{ display: 'grid', gap: '6px', color: '#334155', fontSize: '14px', fontWeight: 600 }}>
                              Assigned to
                              <select
                                value={task.assignedTo?._id || task.assignedTo || ''}
                                onChange={(e) => handleTaskAssigneeChange(task._id, e.target.value)}
                                style={styles.statusSelect}
                              >
                                <option value="">Unassigned</option>
                                {Array.isArray(project.members) && project.members.map(member => (
                                  <option key={member._id} value={member._id}>
                                    {member.name || member.email}
                                  </option>
                                ))}
                              </select>
                            </label>

                            <div style={styles.taskButtonRow}>
                              <button type="button" onClick={() => handleDeleteTask(task._id)} style={styles.dangerButton}>
                                Delete
                              </button>
                              {editingTaskId === task._id ? (
                                <>
                                  <button type="button" onClick={() => handleSaveTaskEdit(task._id)} style={styles.blueButton}>
                                    Save
                                  </button>
                                  <button type="button" onClick={cancelEditingTask} style={styles.neutralButton}>
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <button type="button" onClick={() => startEditingTask(task)} style={styles.neutralButton}>
                                  Edit
                                </button>
                              )}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}