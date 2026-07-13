import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  fetchStatusAnalytics,
  fetchPriorityAnalytics,
  fetchAssigneeAnalytics,
  fetchResolutionTime,
} from '../services/analytics';

const STATUS_COLORS = {
  open: '#3b82f6',
  'in-progress': '#f59e0b',
  done: '#22c55e',
};

const PRIORITY_COLORS = {
  low: '#94a3b8',
  medium: '#3b82f6',
  high: '#ef4444',
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
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '22px',
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
  hero: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    color: '#e2e8f0',
    borderRadius: '24px',
    padding: '28px',
    boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)',
    marginBottom: '22px',
  },
  heroTitle: {
    fontSize: '40px',
    lineHeight: 1.05,
    letterSpacing: '-0.04em',
    margin: '6px 0 10px',
    color: '#fff',
  },
  heroText: {
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#cbd5e1',
    maxWidth: '60ch',
  },
  resolutionCard: {
    background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
    color: '#fff',
    borderRadius: '20px',
    padding: '22px',
    marginBottom: '22px',
    boxShadow: '0 18px 40px rgba(37, 99, 235, 0.28)',
  },
  resolutionValue: {
    fontSize: '36px',
    fontWeight: 800,
    marginTop: '8px',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '18px',
  },
  chartCard: {
    background: 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '24px',
    padding: '20px',
    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
    minHeight: '360px',
  },
  chartTitle: {
    margin: '0 0 16px',
    fontSize: '20px',
    color: '#0f172a',
  },
  error: {
    padding: '12px 14px',
    borderRadius: '12px',
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca',
    marginBottom: '18px',
  },
  note: {
    color: '#64748b',
    fontSize: '14px',
  },
};

const formatLabel = (value) => {
  if (!value) return 'Unknown';
  return String(value).replace(/-/g, ' ');
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [statusData, setStatusData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [assigneeData, setAssigneeData] = useState([]);
  const [avgResolutionTime, setAvgResolutionTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const [status, priority, assignee, resolution] = await Promise.all([
          fetchStatusAnalytics(),
          fetchPriorityAnalytics(),
          fetchAssigneeAnalytics(),
          fetchResolutionTime(),
        ]);

        setStatusData(
          status.map((item) => ({
            name: formatLabel(item._id),
            value: item.count,
            key: item._id,
          }))
        );
        setPriorityData(
          priority.map((item) => ({
            name: formatLabel(item._id),
            count: item.count,
            key: item._id,
          }))
        );
        setAssigneeData(
          assignee.map((item) => ({
            name: item.name || 'Unknown',
            count: item.count,
          }))
        );
        setAvgResolutionTime(resolution.avgResolutionTime);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.topBar}>
          <button onClick={() => navigate('/home')} style={styles.backButton}>
            ← Back to projects
          </button>
        </div>

        <section style={styles.hero}>
          <h1 style={styles.heroTitle}>Analytics Dashboard</h1>
          <p style={styles.heroText}>
            Visualize issue distribution by status, priority, and assignee. Track how quickly work gets resolved across all projects.
          </p>
        </section>

        {error && <div style={styles.error}>{error}</div>}

        {loading ? (
          <p style={styles.note}>Loading analytics...</p>
        ) : (
          <>
            <section style={styles.resolutionCard}>
              <div style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
                Average Resolution Time
              </div>
              <div style={styles.resolutionValue}>
                {avgResolutionTime != null
                  ? `${avgResolutionTime.toFixed(1)} days`
                  : 'N/A'}
              </div>
            </section>

            <div style={styles.chartsGrid}>
              <section style={styles.chartCard}>
                <h2 style={styles.chartTitle}>Issues by Status</h2>
                {statusData.length === 0 ? (
                  <p style={styles.note}>No status data available.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {statusData.map((entry) => (
                          <Cell key={entry.key} fill={STATUS_COLORS[entry.key] || '#64748b'} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </section>

              <section style={styles.chartCard}>
                <h2 style={styles.chartTitle}>Issues by Priority</h2>
                {priorityData.length === 0 ? (
                  <p style={styles.note}>No priority data available.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={priorityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Issues">
                        {priorityData.map((entry) => (
                          <Cell key={entry.key} fill={PRIORITY_COLORS[entry.key] || '#64748b'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </section>

              <section style={{ ...styles.chartCard, gridColumn: '1 / -1' }}>
                <h2 style={styles.chartTitle}>Issues per Assignee</h2>
                {assigneeData.length === 0 ? (
                  <p style={styles.note}>No assignee data available.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={assigneeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Issues" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
