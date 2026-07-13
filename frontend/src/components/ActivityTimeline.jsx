import React from 'react';

const typeIcons = {
  created: '✨',
  updated: '✏️',
  status_changed: '🔄',
  assigned: '👤',
};

const timeAgo = (dateString) => {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Date(dateString).toLocaleDateString();
};

const styles = {
  section: {
    background: 'rgba(255,255,255,0.84)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '24px',
    padding: '20px',
    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
    marginTop: '18px',
  },
  title: {
    margin: '0 0 6px',
    fontSize: '22px',
    color: '#0f172a',
  },
  note: {
    color: '#64748b',
    margin: '0 0 16px',
    fontSize: '14px',
  },
  feed: {
    display: 'grid',
    gap: '0',
  },
  item: {
    display: 'flex',
    gap: '14px',
    padding: '14px 0',
    borderBottom: '1px solid #f1f5f9',
  },
  icon: {
    width: '36px',
    height: '36px',
    borderRadius: '12px',
    background: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
  },
  message: {
    margin: 0,
    color: '#0f172a',
    fontSize: '14px',
    lineHeight: 1.5,
    fontWeight: 500,
  },
  time: {
    margin: '4px 0 0',
    color: '#94a3b8',
    fontSize: '12px',
  },
  empty: {
    textAlign: 'center',
    padding: '32px 16px',
    color: '#64748b',
  },
  emptyTitle: {
    margin: '0 0 6px',
    fontWeight: 700,
    color: '#0f172a',
    fontSize: '16px',
  },
};

export default function ActivityTimeline({ activities, loading }) {
  if (loading) {
    return (
      <section style={styles.section}>
        <h2 style={styles.title}>Activity</h2>
        <p style={styles.note}>Loading activity feed...</p>
      </section>
    );
  }

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>Activity</h2>
      <p style={styles.note}>Recent project updates — like Jira or Linear.</p>

      {activities.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyTitle}>No activity yet</p>
          <p style={{ margin: 0 }}>Create or update an issue to see the timeline.</p>
        </div>
      ) : (
        <div style={styles.feed}>
          {activities.map((activity) => (
            <div key={activity._id} style={styles.item}>
              <div style={styles.icon}>{typeIcons[activity.type] || '📌'}</div>
              <div>
                <p style={styles.message}>{activity.message}</p>
                <p style={styles.time}>{timeAgo(activity.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
