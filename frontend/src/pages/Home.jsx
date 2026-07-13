import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, fetchDeletedProjects, createProject, addProjectMember, restoreProject, deleteProject } from '../services/projects';
import { fetchTasks } from '../services/tasks';

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

const styles = {
  page: {
    minHeight: '100vh',
    padding: '28px',
    background: 'radial-gradient(circle at top left, rgba(15, 23, 42, 0.06), transparent 32%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
    color: '#0f172a',
  },
  shell: {
    maxWidth: '1280px',
    margin: '0 auto',
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: '1.35fr 0.95fr',
    gap: '18px',
    alignItems: 'stretch',
    marginBottom: '22px',
  },
  heroCard: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    color: '#e2e8f0',
    borderRadius: '24px',
    padding: '28px',
    boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)',
  },
  heroTitle: {
    fontSize: '48px',
    lineHeight: 1.02,
    letterSpacing: '-0.04em',
    margin: '6px 0 14px',
    color: '#fff',
  },
  heroText: {
    fontSize: '16px',
    lineHeight: 1.6,
    maxWidth: '62ch',
    color: '#cbd5e1',
  },
  heroActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '20px',
  },
  logoutButton: {
    padding: '12px 16px',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.12)',
    color: '#fff',
    fontWeight: 600,
  },
  createCard: {
    background: '#fff',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    borderRadius: '24px',
    padding: '22px',
    maxWidth: '440px',
    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
    justifySelf: 'end',
  },
  sectionTitle: {
    fontSize: '18px',
    margin: '0 0 12px',
    color: '#0f172a',
  },
  field: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 14px',
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    background: '#fff',
    color: '#0f172a',
    outline: 'none',
    fontSize: '14px',
  },
  createButton: {
    padding: '12px 16px',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    fontWeight: 700,
    color: '#fff',
    background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
    boxShadow: '0 12px 26px rgba(37, 99, 235, 0.28)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
    marginBottom: '22px',
  },
  statCard: {
    background: '#fff',
    border: '1px solid rgba(148, 163, 184, 0.24)',
    borderRadius: '20px',
    padding: '18px',
    boxShadow: '0 14px 30px rgba(15, 23, 42, 0.06)',
  },
  statValue: {
    fontSize: '30px',
    fontWeight: 800,
    color: '#0f172a',
    marginTop: '8px',
  },
  statLabel: {
    fontSize: '13px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  sectionBlock: {
    background: 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '24px',
    padding: '20px',
    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
  },
  projectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '16px',
  },
  projectCard: {
    background: '#fff',
    border: '1px solid rgba(148, 163, 184, 0.22)',
    borderRadius: '22px',
    padding: '18px',
    boxShadow: '0 18px 30px rgba(15, 23, 42, 0.06)',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
  },
  projectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  projectTitle: {
    margin: 0,
    fontSize: '20px',
    lineHeight: 1.2,
    color: '#0f172a',
  },
  projectMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    margin: '14px 0 0',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
    background: '#e2e8f0',
    color: '#334155',
  },
  chipPrimary: {
    background: '#dbeafe',
    color: '#1d4ed8',
  },
  chipSuccess: {
    background: '#dcfce7',
    color: '#166534',
  },
  chipInfo: {
    background: '#ede9fe',
    color: '#6d28d9',
  },
  chipWarning: {
    background: '#fef3c7',
    color: '#92400e',
  },
  chipDanger: {
    background: '#fee2e2',
    color: '#991b1b',
  },
  chipMuted: {
    background: '#f1f5f9',
    color: '#475569',
  },
  memberInputRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '14px',
  },
  memberInput: {
    flex: '1 1 220px',
    padding: '10px 12px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
  },
  memberButton: {
    padding: '10px 14px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    color: '#fff',
    fontWeight: 700,
    boxShadow: '0 12px 24px rgba(37, 99, 235, 0.22)',
  },
  secondaryButton: {
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid #bbf7d0',
    cursor: 'pointer',
    background: '#dcfce7',
    color: '#166534',
    fontWeight: 700,
  },
  dangerButton: {
    padding: '10px 14px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    background: '#dc2626',
    color: '#fff',
    fontWeight: 700,
  },
  primaryButton: {
    padding: '12px 16px',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    fontWeight: 700,
    color: '#fff',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    boxShadow: '0 12px 26px rgba(37, 99, 235, 0.28)',
  },
  neutralButton: {
    padding: '12px 16px',
    border: '1px solid rgba(148, 163, 184, 0.35)',
    borderRadius: '14px',
    cursor: 'pointer',
    fontWeight: 700,
    color: '#0f172a',
    background: '#fff',
  },
  deleteSection: {
    marginTop: '22px',
    padding: '20px',
    borderRadius: '24px',
    background: 'rgba(248, 250, 252, 0.9)',
    border: '1px solid rgba(148, 163, 184, 0.22)',
  },
  deletedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '14px',
  },
  deletedCard: {
    background: '#fff',
    border: '1px dashed #cbd5e1',
    borderRadius: '18px',
    padding: '16px',
  },
  projectTitleBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    marginBottom: '12px',
  },
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '14px',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: '1 1 280px',
    padding: '12px 14px',
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    background: '#fff',
    color: '#0f172a',
  },
  note: {
    color: '#64748b',
    fontSize: '14px',
    marginTop: '8px',
  },
};

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [deletedProjects, setDeletedProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberEmails, setMemberEmails] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [taskSummary, setTaskSummary] = useState({ active: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUserId = getCurrentUserId();
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const [activeProjects, removedProjects] = await Promise.all([
        fetchProjects(),
        fetchDeletedProjects(),
      ]);

      const taskResults = await Promise.allSettled(
        activeProjects.map(async (project) => ({
          projectId: project._id,
          tasks: await fetchTasks(project._id),
        }))
      );

      const summary = taskResults.reduce((accumulator, result) => {
        if (result.status !== 'fulfilled') return accumulator;

        const { tasks } = result.value;
        const activeTaskCount = tasks.filter(task => (task.status || 'open') !== 'done').length;
        const completedTaskCount = tasks.filter(task => (task.status || 'open') === 'done').length;

        accumulator.active += activeTaskCount;
        accumulator.completed += completedTaskCount;
        return accumulator;
      }, { active: 0, completed: 0 });

      setProjects(activeProjects);
      setDeletedProjects(removedProjects);
      setTaskSummary(summary);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Project name required');
      return;
    }

    try {
      await createProject({ title: name, description });
      setName('');
      setDescription('');
      load();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const handleAddMember = async (projectId) => {
    const email = (memberEmails[projectId] || '').trim();
    if (!email) {
      alert('Member email required');
      return;
    }

    try {
      await addProjectMember(projectId, { email });
      setMemberEmails(prev => ({ ...prev, [projectId]: '' }));
      load();
    } catch (err) {
      alert('Failed to add member: ' + err.message);
    }
  };

  const handleRestoreProject = async (projectId) => {
    try {
      await restoreProject(projectId);
      load();
    } catch (err) {
      alert('Failed to restore project: ' + err.message);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Soft delete this project? It will be hidden from the home page.')) return;

    try {
      await deleteProject(projectId);
      load();
    } catch (err) {
      alert('Failed to delete project: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const activeProjects = projects.filter(project => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    return [project.title || project.name, project.description, ...(project.members || []).map(member => member.name || member.email)]
      .filter(Boolean)
      .some(value => value.toLowerCase().includes(query));
  });

  const stats = useMemo(() => {
    return [
      { label: 'Active Projects', value: projects.length, tone: styles.chipInfo },
      { label: 'Active Tasks', value: taskSummary.active, tone: styles.chipWarning },
      { label: 'Completed Tasks', value: taskSummary.completed, tone: styles.chipSuccess },
    ];
  }, [projects.length, taskSummary.active, taskSummary.completed]);

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.hero}>
          <section style={styles.heroCard}>
            <div style={styles.projectTitleBar}>
              <span style={{ ...styles.chip, background: 'rgba(255,255,255,0.1)', color: '#e2e8f0' }}>Issue Tracker</span>
              <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </div>
            <h1 style={styles.heroTitle}>Project dashboard</h1>
            <p style={styles.heroText}>
              Create projects, add members, and keep work organized in a cleaner dashboard view.
              Active projects stay front and center, while deleted ones remain available to restore.
            </p>
            <div style={styles.heroActions}>
              <button type="button" onClick={() => navigate('/dashboard')} style={styles.logoutButton}>
                Analytics Dashboard
              </button>
              <span style={{ ...styles.chip, background: 'rgba(255,255,255,0.12)', color: '#fff' }}>Members only tasks</span>
              <span style={{ ...styles.chip, background: 'rgba(255,255,255,0.12)', color: '#fff' }}>Soft delete enabled</span>
              <span style={{ ...styles.chip, background: 'rgba(255,255,255,0.12)', color: '#fff' }}>Kanban task board</span>
            </div>
          </section>

          <aside style={styles.createCard}>
            <h2 style={styles.sectionTitle}>Create a project</h2>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gap: '10px' }}>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Project name"
                  required
                  style={styles.field}
                />
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Short description"
                  rows={4}
                  style={{ ...styles.field, resize: 'vertical', minHeight: '110px' }}
                />
                <button type="submit" style={styles.primaryButton}>Create project</button>
              </div>
            </form>
            <p style={styles.note}>New projects automatically add you as a member so you can manage tasks immediately.</p>
          </aside>
        </div>

        <section style={styles.statsGrid}>
          {stats.map(stat => (
            <div key={stat.label} style={styles.statCard}>
              <div style={{ ...styles.chip, ...stat.tone }}>{stat.label}</div>
              <div style={styles.statValue}>{stat.value}</div>
            </div>
          ))}
        </section>

        {error && (
          <div style={{ ...styles.sectionBlock, marginBottom: '18px', borderColor: '#fecaca', background: '#fff1f2' }}>
            <strong style={{ color: '#991b1b' }}>Error:</strong> <span style={{ color: '#7f1d1d' }}>{error}</span>
          </div>
        )}

        <section style={styles.sectionBlock}>
          <div style={styles.searchRow}>
            <div>
              <h2 style={styles.sectionTitle}>Active projects</h2>
              <p style={styles.note}>Search by project name, description, or member.</p>
            </div>
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search projects"
              style={styles.searchInput}
            />
          </div>

          {loading ? (
            <p style={styles.note}>Loading projects...</p>
          ) : activeProjects.length === 0 ? (
            <div style={{ padding: '28px 12px', textAlign: 'center', color: '#64748b' }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>No active projects found</p>
              <p style={{ marginTop: '8px' }}>Create one above or clear your search.</p>
            </div>
          ) : (
            <div style={styles.projectGrid}>
              {activeProjects.map(project => {
                const isCreator = project.createdBy && project.createdBy._id === currentUserId;

                return (
                  <article
                    key={project._id}
                    onClick={() => navigate(`/project/${project._id}`)}
                    style={styles.projectCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 22px 40px rgba(15, 23, 42, 0.12)';
                      e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.35)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 18px 30px rgba(15, 23, 42, 0.06)';
                      e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.22)';
                    }}
                  >
                    <div style={styles.projectHeader}>
                      <div>
                        <h3 style={styles.projectTitle}>{project.title || project.name}</h3>
                        <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ ...styles.chip, background: '#dbeafe', color: '#1d4ed8' }}>Active</span>
                          {isCreator && <span style={{ ...styles.chip, background: '#fef3c7', color: '#92400e' }}>Creator</span>}
                        </div>
                      </div>
                      <span style={{ ...styles.chip, background: '#e2e8f0', color: '#334155' }}>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {project.description ? (
                      <p style={{ color: '#475569', lineHeight: 1.6, margin: '0 0 12px' }}>{project.description}</p>
                    ) : (
                      <p style={{ color: '#94a3b8', margin: '0 0 12px' }}>No description added yet.</p>
                    )}

                    <div style={styles.projectMeta}>
                      <span style={{ ...styles.chip, ...styles.chipMuted }}>
                        {Array.isArray(project.members) ? `${project.members.length} members` : '0 members'}
                      </span>
                      <span style={{ ...styles.chip, ...styles.chipSuccess }}>
                        Creator: {project.createdBy?.name || project.createdBy?.email || 'Unknown'}
                      </span>
                    </div>

                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}
                    >
                      <div style={styles.memberInputRow}>
                        <input
                          value={memberEmails[project._id] || ''}
                          onChange={(e) => setMemberEmails(prev => ({ ...prev, [project._id]: e.target.value }))}
                          placeholder="Add member by email"
                          style={styles.memberInput}
                        />
                        <button type="button" onClick={() => handleAddMember(project._id)} style={styles.memberButton}>
                          Add Member
                        </button>
                      </div>

                      {Array.isArray(project.members) && project.members.length > 0 && (
                        <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {project.members.map(member => (
                            <span key={member._id} style={{ ...styles.chip, background: '#f1f5f9', color: '#0f172a' }}>
                              {member.name || member.email}
                            </span>
                          ))}
                        </div>
                      )}

                      {isCreator && (
                        <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project._id);
                            }}
                            style={styles.dangerButton}
                          >
                            Delete Project
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {deletedProjects.length > 0 && (
          <section style={styles.deleteSection}>
            <div style={styles.searchRow}>
              <div>
                <h2 style={styles.sectionTitle}>Deleted projects</h2>
                <p style={styles.note}>Only you can see and restore these projects.</p>
              </div>
            </div>

            <div style={styles.deletedGrid}>
              {deletedProjects.map(project => (
                <article key={project._id} style={styles.deletedCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <div>
                      <h3 style={{ margin: 0, color: '#0f172a' }}>{project.title || project.name}</h3>
                      <p style={{ margin: '8px 0 0', color: '#64748b', lineHeight: 1.5 }}>
                        {project.description || 'No description added.'}
                      </p>
                    </div>
                    <span style={{ ...styles.chip, background: '#fee2e2', color: '#991b1b' }}>Deleted</span>
                  </div>

                  <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ ...styles.chip, background: '#f1f5f9', color: '#0f172a' }}>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRestoreProject(project._id)}
                      style={styles.secondaryButton}
                    >
                      Restore Project
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}