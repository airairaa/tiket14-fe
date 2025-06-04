import React, { useState } from 'react';
import { registerUser } from '../api/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(username, email, password);
      if (response.message === 'User registered successfully') {
        navigate('/login');
      } else {
        setError(response.message || 'Register gagal');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(to right, #36d1dc, #5b86e5)',
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
      color: '#36d1dc',
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
      background: '#36d1dc',
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
      background: '#2980b9',
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
        <h2 style={styles.title}>📝 Buat Akun Baru</h2>
        <p style={styles.subtitle}>Daftar untuk mulai booking tiket event seru!</p>
        {error && <div style={styles.errorBox}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nama Pengguna"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email Aktif"
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
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => e.target.style.background = styles.buttonHover.background}
            onMouseOut={(e) => e.target.style.background = styles.button.background}
          >
            Daftar
          </button>
        </form>
        <p style={styles.footerNote}>Sudah punya akun? <a href="/login">Masuk di sini</a></p>
      </div>
    </div>
  );
};

export default Register;
