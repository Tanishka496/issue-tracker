import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, fetchDeletedProjects, createProject, addProjectMember, restoreProject, deleteProject } from '../services/projects';

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

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [deletedProjects, setDeletedProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberEmails, setMemberEmails] = useState({});
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
      setProjects(activeProjects);
      setDeletedProjects(removedProjects);
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

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Projects</h1>
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '8px 15px', 
            backgroundColor: '#dc3545', 
            color: '#fff', 
            border: 'none', 
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          Logout
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <form onSubmit={handleCreate} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Project name" 
          required 
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="Description" 
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button type="submit" style={{ padding: '5px 15px' }}>Create</button>
      </form>

      <h2>Projects</h2>
      {loading ? <p>Loading...</p> : projects.length === 0 ? (
        <p>No projects</p>
      ) : (
        <ul>
          
          {projects.map(p => (
            <li 
              key={p._id} 
              onClick={() => navigate(`/project/${p._id}`)}
              style={{ 
                marginBottom: '10px', 
                padding: '10px', 
                border: '1px solid #ddd',
                cursor: 'pointer',
                borderRadius: '4px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <strong>{p.title || p.name}</strong>
              {p.description && <p>{p.description}</p>}
              <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '10px' }}>
                <input
                  value={memberEmails[p._id] || ''}
                  onChange={(e) => setMemberEmails(prev => ({ ...prev, [p._id]: e.target.value }))}
                  placeholder="Add member by email"
                  style={{ marginRight: '8px', padding: '5px', minWidth: '220px' }}
                />
                <button
                  type="button"
                  onClick={() => handleAddMember(p._id)}
                  style={{ padding: '5px 12px' }}
                >
                  Add Member
                </button>
              </div>
              {Array.isArray(p.members) && p.members.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <small>Members: {p.members.map(member => member.name || member.email).join(', ')}</small>
                </div>
              )}
              {p.createdBy && p.createdBy._id === currentUserId && (
                <div style={{ marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(p._id);
                    }}
                    style={{ padding: '5px 12px', backgroundColor: '#b91c1c', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                  >
                    Delete Project
                  </button>
                </div>
              )}
              <small>{new Date(p.createdAt).toLocaleDateString()}</small>
            </li>
          ))}

        </ul>
      )}

      {deletedProjects.length > 0 && (
        <>
          <h2 style={{ marginTop: '30px' }}>Deleted Projects</h2>
          <ul>
            {deletedProjects.map(p => (
              <li
                key={p._id}
                style={{
                  marginBottom: '10px',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#fafafa'
                }}
              >
                <strong>{p.title || p.name}</strong>
                {p.description && <p>{p.description}</p>}
                <div style={{ marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleRestoreProject(p._id)}
                    style={{ padding: '5px 12px' }}
                  >
                    Restore Project
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}