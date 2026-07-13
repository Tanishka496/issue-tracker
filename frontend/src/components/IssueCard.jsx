import React, { useState } from 'react';

const priorityStyles = {
  high: { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca' },
  medium: { bg: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe' },
  low: { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' },
};

const statusStyles = {
  open: { bg: '#dbeafe', color: '#1d4ed8', label: 'Open' },
  'in-progress': { bg: '#fef3c7', color: '#b45309', label: 'In Progress' },
  done: { bg: '#dcfce7', color: '#15803d', label: 'Closed' },
};

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const avatarColor = (name = '') => {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const issueNumber = (id) => `#${String(id).slice(-4).toUpperCase()}`;

export default function IssueCard({
  task,
  members,
  editingTaskId,
  editingTaskTitle,
  onEditTitleChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onStatusChange,
  onAssigneeChange,
}) {
  const [hovered, setHovered] = useState(false);
  const priority = task.priority || 'medium';
  const status = task.status || 'open';
  const pStyle = priorityStyles[priority] || priorityStyles.medium;
  const sStyle = statusStyles[status] || statusStyles.open;
  const assignee = task.assignedTo;
  const assigneeName = assignee ? (assignee.name || assignee.email) : null;
  const isEditing = editingTaskId === task._id;

  const cardStyle = {
    background: '#fff',
    border: hovered ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: hovered
      ? '0 16px 32px rgba(15, 23, 42, 0.1)'
      : '0 8px 18px rgba(15, 23, 42, 0.05)',
    transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
    transition: 'all 0.18s ease',
  };

  return (
    <article
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#94a3b8',
            letterSpacing: '0.06em',
          }}>
            {issueNumber(task._id)}
          </span>
          <span style={{
            display: 'inline-flex',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 700,
            background: pStyle.bg,
            color: pStyle.color,
            border: `1px solid ${pStyle.border}`,
            textTransform: 'capitalize',
          }}>
            {priority}
          </span>
          <span style={{
            display: 'inline-flex',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 700,
            background: sStyle.bg,
            color: sStyle.color,
          }}>
            {sStyle.label}
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>

      {isEditing ? (
        <input
          value={editingTaskTitle}
          onChange={(e) => onEditTitleChange(e.target.value)}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '10px 12px',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            marginBottom: '10px',
          }}
        />
      ) : (
        <>
          <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
            {task.title}
          </h4>
          {task.description && (
            <p style={{ margin: '0 0 12px', color: '#64748b', fontSize: '13px', lineHeight: 1.55 }}>
              {task.description}
            </p>
          )}
        </>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 12px',
        background: '#f8fafc',
        borderRadius: '12px',
        marginBottom: '12px',
      }}>
        {assigneeName ? (
          <>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: avatarColor(assigneeName),
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
              flexShrink: 0,
            }}>
              {getInitials(assigneeName)}
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Assigned to</div>
              <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>{assigneeName}</div>
            </div>
          </>
        ) : (
          <div style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Unassigned</div>
        )}
      </div>

      <div style={{ display: 'grid', gap: '8px' }}>
        <label style={{ display: 'grid', gap: '4px', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
          Status
          <select
            value={status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            style={{
              padding: '8px 10px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              background: '#fff',
              fontSize: '13px',
            }}
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Closed</option>
          </select>
        </label>

        <label style={{ display: 'grid', gap: '4px', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
          Assign to
          <select
            value={assignee?._id || assignee || ''}
            onChange={(e) => onAssigneeChange(task._id, e.target.value)}
            style={{
              padding: '8px 10px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              background: '#fff',
              fontSize: '13px',
            }}
          >
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name || member.email}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
        <button
          type="button"
          onClick={() => onDelete(task._id)}
          style={{
            padding: '8px 12px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            background: '#fee2e2',
            color: '#b91c1c',
            fontWeight: 600,
            fontSize: '12px',
          }}
        >
          Delete
        </button>
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={() => onSaveEdit(task._id)}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                background: '#2563eb',
                color: '#fff',
                fontWeight: 600,
                fontSize: '12px',
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                background: '#fff',
                color: '#0f172a',
                fontWeight: 600,
                fontSize: '12px',
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => onStartEdit(task)}
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              background: '#fff',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '12px',
            }}
          >
            Edit
          </button>
        )}
      </div>
    </article>
  );
}
