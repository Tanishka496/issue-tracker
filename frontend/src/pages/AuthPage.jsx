import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../services/auth';

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
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h1>{isLogin ? 'Login' : 'Register'}</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={!isLogin}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
}