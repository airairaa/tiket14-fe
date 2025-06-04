import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth(); // gunakan fungsi login dari context
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gunakan fungsi login dari context, dengan endpoint disesuaikan di context
      const endpoint = isAdmin ? '/api/auth/admin/login' : '/api/auth/users/login';

      // Panggil login dengan endpoint dan data
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        setMessage('Error: Response bukan JSON valid');
        return;
      }

      if (response.ok) {
        // Simpan token dan user di context dan localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ username: data.username, role: data.role }));
        // Update user di context
        login(email, password); // atau setUser({ username: data.username, role: data.role }) jika expose setUser
        setMessage(`${isAdmin ? 'Admin' : 'User'} logged in successfully!`);

        // Navigasi sesuai role
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } else {
        setMessage(data.message || 'Login gagal');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  // Styles tetap sama seperti kode Anda sebelumnya

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(to right, #f83600, #f9d423)',
      fontFamily: 'Segoe UI, sans-serif',
    },
    card: {
      background: '#fff',
      padding: '2rem 2.5rem',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      maxWidth: '400px',
      width: '100%',
      textAlign: 'center',
    },
    title: {
      marginBottom: '0.5rem',
      color: '#f83600',
    },
    subtitle: {
      fontSize: '0.9rem',
      color: '#444',
      marginBottom: '1.5rem',
    },
    input: {
      display: 'block',
      width: '100%',
      padding: '0.75rem',
      marginBottom: '1rem',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '1rem',
    },
    button: {
      background: '#f83600',
      color: 'white',
      border: 'none',
      padding: '0.75rem',
      width: '100%',
      borderRadius: '8px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
    },
    buttonHover: {
      background: '#d02b00',
    },
    errorBox: {
      backgroundColor: '#ffe5e5',
      borderLeft: '4px solid #ff4b4b',
      padding: '0.5rem 1rem',
      marginBottom: '1rem',
      color: '#d10000',
      borderRadius: '8px',
    },
    footerNote: {
      fontSize: '0.85rem',
      color: '#777',
      marginTop: '1rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🎫 Event Ticket Login</h2>
        <p style={styles.subtitle}>Masuk untuk mengelola atau memesan tiket event favoritmu!</p>
        {message && <div style={styles.errorBox}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Pengguna"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <label>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={() => setIsAdmin(!isAdmin)}
            />{' '}
            Login sebagai Admin
          </label>
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.background = styles.buttonHover.background)}
            onMouseOut={(e) => (e.target.style.background = styles.button.background)}
          >
            Masuk
          </button>
        </form>
        <p style={styles.footerNote}>
          Belum punya akun? <a href="/register">Daftar di sini</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
