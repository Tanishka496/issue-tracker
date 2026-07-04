import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../services/auth';

const styles = {
  page: {
    minHeight: '100vh',
    padding: '28px',
    background: 'radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 28%), radial-gradient(circle at bottom right, rgba(99, 102, 241, 0.12), transparent 24%), linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)',
    color: '#0f172a',
    display: 'grid',
    placeItems: 'center',
  },
  shell: {
    width: 'min(1120px, 100%)',
    display: 'grid',
    gridTemplateColumns: '1.05fr 0.95fr',
    gap: '18px',
    alignItems: 'stretch',
  },
  hero: {
    borderRadius: '28px',
    padding: '34px',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)',
    color: '#e2e8f0',
    boxShadow: '0 28px 70px rgba(15, 23, 42, 0.22)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '540px',
  },
  brand: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    width: 'fit-content',
    padding: '8px 12px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '13px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: '56px',
    lineHeight: 1.02,
    letterSpacing: '-0.05em',
    margin: '18px 0 14px',
    color: '#fff',
  },
  heroText: {
    fontSize: '17px',
    lineHeight: 1.7,
    color: '#cbd5e1',
    maxWidth: '58ch',
  },
  featureRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '22px',
  },
  featureChip: {
    padding: '8px 12px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.08)',
    color: '#e2e8f0',
    fontSize: '13px',
    fontWeight: 600,
  },
  heroFooter: {
    marginTop: '32px',
    paddingTop: '18px',
    borderTop: '1px solid rgba(255,255,255,0.12)',
    color: '#cbd5e1',
    fontSize: '14px',
    lineHeight: 1.6,
  },
  card: {
    borderRadius: '28px',
    padding: '30px',
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(14px)',
    border: '1px solid rgba(148, 163, 184, 0.22)',
    boxShadow: '0 22px 50px rgba(15, 23, 42, 0.12)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  heading: {
    margin: '0 0 10px',
    fontSize: '30px',
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
    color: '#0f172a',
  },
  subheading: {
    margin: '0 0 22px',
    color: '#475569',
    lineHeight: 1.6,
  },
  form: {
    display: 'grid',
    gap: '14px',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '13px 14px',
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    background: '#fff',
    color: '#0f172a',
    outline: 'none',
    fontSize: '15px',
  },
  primaryButton: {
    padding: '13px 16px',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '15px',
    boxShadow: '0 14px 28px rgba(37, 99, 235, 0.28)',
  },
  toggleRow: {
    marginTop: '18px',
    textAlign: 'center',
    color: '#475569',
    fontSize: '14px',
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    cursor: 'pointer',
    fontWeight: 700,
    marginLeft: '6px',
    padding: 0,
  },
  error: {
    marginBottom: '14px',
    padding: '10px 12px',
    borderRadius: '12px',
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca',
  },
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = isLogin 
        ? { email, password }
        : { name, email, password };

      const data = isLogin ? await login(payload) : await register(payload);

      // Save token
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Redirect to home
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <section style={styles.hero}>
          <div>
            <div style={styles.brand}>Issue Tracker</div>
            <h1 style={styles.heroTitle}>Work gets clearer when the board does.</h1>
            <p style={styles.heroText}>
              Track projects, assign tasks, move work through statuses, and keep visibility on who created and owns each item.
            </p>

            <div style={styles.featureRow}>
              <span style={styles.featureChip}>Project dashboard</span>
              <span style={styles.featureChip}>Task assignment</span>
              <span style={styles.featureChip}>Soft delete</span>
              <span style={styles.featureChip}>Member access control</span>
            </div>
          </div>

          <div style={styles.heroFooter}>
            Designed for a compact workflow: create a project, add members, and keep every task visible by status.
          </div>
        </section>

        <section style={styles.card}>
          <h1 style={styles.heading}>{isLogin ? 'Welcome back' : 'Create your account'}</h1>
          <p style={styles.subheading}>
            {isLogin
              ? 'Sign in to continue managing projects and tasks.'
              : 'Register to start your first project and invite team members.'}
          </p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={!isLogin}
            style={styles.input}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

            <button type="submit" style={styles.primaryButton}>
          {isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <div style={styles.toggleRow}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              style={styles.toggleButton}
              type="button"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}