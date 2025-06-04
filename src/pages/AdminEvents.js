import React, { useState, useEffect } from 'react';
import { fetchEvents, addEvent, updateEvent, deleteEvent } from '../api/api';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ 
    id: null, 
    name: '', 
    date: '', 
    location: '',
    image_path: '',
    image_file: null 
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
      setError(null);
    } catch {
      setError('Gagal memuat data event');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image_file: file, image_path: '' });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.date || !form.location) {
      alert('Nama, tanggal, dan lokasi harus diisi');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('date', form.date);
      formData.append('location', form.location);
      
      if (form.image_file) {
        formData.append('image', form.image_file);
      }
  
      if (isEditing) {
        await updateEvent(form.id, formData);
        alert('Event diperbarui');
      } else {
        await addEvent(formData);
        alert('Event ditambahkan');
      }
      
      resetForm();
      loadEvents();
    } catch (err) {
      console.error('Error:', err);
      alert(err.message || 'Terjadi kesalahan saat menyimpan event');
    }
  };

  const resetForm = () => {
    setForm({ 
      id: null, 
      name: '', 
      date: '', 
      location: '',
      image_path: '',
      image_file: null 
    });
    setPreviewImage(null);
    setIsEditing(false);
  };

  const handleEdit = (event) => {
    setForm({ 
      id: event.id, 
      name: event.name, 
      date: event.date.split('T')[0],
      location: event.location,
      image_path: event.image_path,
      image_file: null
    });
    setPreviewImage(event.image_path ? `http://localhost:5000/public${event.image_path}` : null);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus event ini?')) {
      try {
        await deleteEvent(id);
        alert('Event dihapus');
        loadEvents();
      } catch {
        alert('Gagal menghapus event');
      }
    }
  };

  const formatDate = (isoString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(isoString).toLocaleDateString('id-ID', options);
  };
  
  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(to right, #ff512f, #f09819)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '30px',
    },
    container: {
      background: '#fff',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      width: '90%',
      maxWidth: '900px',
    },
    title: {
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#ff5722',
    },
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginBottom: '20px',
      justifyContent: 'center',
    },
    input: {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '6px',
      minWidth: '200px',
    },
    button: {
      padding: '10px 16px',
      border: 'none',
      color: 'white',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    smallButton: {
      margin: '2px',
      padding: '6px 10px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    imagePreview: {
      maxWidth: '100px',
      maxHeight: '60px',
      objectFit: 'cover',
      borderRadius: '4px'
    },
    tableImage: {
      width: '80px',
      height: '50px',
      objectFit: 'cover',
      borderRadius: '4px'
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
        }
        input, button, select {
          font-family: inherit;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          padding: 12px;
          border: 1px solid #ddd;
          text-align: center;
        }
        th {
          background: #f5f5f5;
          font-weight: bold;
        }
        tr:hover {
          background-color: #f9f9f9;
        }
      `}</style>

      <div style={styles.container}>
        <h2 style={styles.title}>🎫 Admin Event</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Nama Event"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Lokasi"
            value={form.location}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload" style={{ 
              ...styles.button, 
              backgroundColor: '#4CAF50',
              textAlign: 'center',
              cursor: 'pointer'
            }}>
              {form.image_path || previewImage ? 'Ganti Gambar' : 'Pilih Gambar'}
            </label>
            {(previewImage || form.image_path) && (
              <img 
                src={previewImage || `http://localhost:5000/public${form.image_path}`}
                alt="Preview"
                style={styles.imagePreview}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder.jpg';
                }}
              />
            )}
          </div>
          
          <button type="submit" style={{ ...styles.button, backgroundColor: '#ff5722' }}>
            {isEditing ? 'Update' : 'Tambah'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              style={{ ...styles.button, backgroundColor: '#999' }}
            >
              Batal
            </button>
          )}
        </form>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Event</th>
                <th>Tanggal</th>
                <th>Lokasi</th>
                <th>Gambar</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    Tidak ada data event
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id}>
                    <td>{event.id}</td>
                    <td>{event.name}</td>
                    <td>{formatDate(event.date)}</td>
                    <td>{event.location || '-'}</td>
                    <td>
                      {event.image_path ? (
                        <img 
                          src={`http://localhost:5000/public${event.image_path}`}
                          alt={event.name}
                          style={styles.tableImage}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder.jpg';
                          }}
                        />
                      ) : (
                        <span style={{ color: '#999' }}>No image</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(event)}
                        style={{ ...styles.smallButton, backgroundColor: '#ffc107' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        style={{ ...styles.smallButton, backgroundColor: '#dc3545', color: 'white' }}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;