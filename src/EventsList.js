import React, { useState, useEffect } from 'react';

function EventsList() {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/events'; // sesuaikan dengan backend Anda

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setLoading(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Nama event wajib diisi';
    if (!date) errs.date = 'Tanggal event wajib diisi';
    return errs;
  };

  const resetForm = () => {
    setName('');
    setDate('');
    setErrors({});
  };

  const handleAddEvent = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, date }),
      });
      if (!res.ok) throw new Error('Failed to add event');
      const newEvent = await res.json();
      setEvents([...events, newEvent]);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditEvent = (event) => {
    setIsEditing(true);
    setCurrentEventId(event.id);
    setName(event.name);
    setDate(event.date);
    setErrors({});
  };

  const handleUpdateEvent = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/${currentEventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, date }),
      });
      if (!res.ok) throw new Error('Failed to update event');
      const updatedEvent = await res.json();
      setEvents(events.map(ev => (ev.id === currentEventId ? updatedEvent : ev)));
      resetForm();
      setIsEditing(false);
      setCurrentEventId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus event ini?')) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete event');
        setEvents(events.filter(ev => ev.id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <p className="loading">Loading events...</p>;

  return (
    <div className="container">
      <header>
        <h1>Sistem Manajemen Event & Tiket</h1>
        <nav>
          <a href="/register" className="nav-link">Register</a>
          <a href="/login" className="nav-link">Login</a>
        </nav>
      </header>

      <section className="form-section">
        <h2>{isEditing ? 'Edit Event' : 'Tambah Event Baru'}</h2>
        <div className="form">
          <label>
            Nama Event
            <input
              type="text"
              placeholder="Masukkan nama event"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <small className="error">{errors.name}</small>}
          </label>

          <label>
            Tanggal Event
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={errors.date ? 'input-error' : ''}
            />
            {errors.date && <small className="error">{errors.date}</small>}
          </label>

          <div className="buttons">
            {isEditing ? (
              <>
                <button onClick={handleUpdateEvent} className="btn update">Update</button>
                <button onClick={() => { resetForm(); setIsEditing(false); }} className="btn cancel">Batal</button>
              </>
            ) : (
              <button onClick={handleAddEvent} className="btn add">Tambah Event</button>
            )}
          </div>
        </div>
      </section>

      <section className="events-list-section">
        <h2>Daftar Event</h2>
        {events.length === 0 ? (
          <p className="no-events">Belum ada event yang terdaftar.</p>
        ) : (
          <div className="events-list">
            {events.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-info">
                  <h3>{event.name}</h3>
                  <p>{new Date(event.date).toLocaleDateString('id-ID', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}</p>
                </div>
                <div className="actions">
                  <button onClick={() => handleEditEvent(event)} className="btn edit">Edit</button>
                  <button onClick={() => handleDeleteEvent(event.id)} className="btn delete">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Styling */}
      <style jsx>{`
        * {
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f4f7f8;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 900px;
          margin: 2rem auto;
          padding: 1rem 2rem;
          background: white;
          border-radius: 10px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 0.5rem;
        }
        header h1 {
          font-size: 1.8rem;
          color: #2c3e50;
        }
        nav .nav-link {
          margin-left: 1rem;
          text-decoration: none;
          color: #3498db;
          font-weight: 600;
          transition: color 0.3s ease;
        }
        nav .nav-link:hover {
          color: #2980b9;
        }
        .form-section h2,
        .events-list-section h2 {
          color: #34495e;
          margin-bottom: 1rem;
          border-left: 5px solid #3498db;
          padding-left: 0.5rem;
        }
        .form {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: flex-end;
        }
        label {
          flex: 1 1 45%;
          display: flex;
          flex-direction: column;
          font-weight: 600;
          color: #34495e;
        }
        input[type="text"],
        input[type="date"] {
          padding: 0.5rem 0.75rem;
          font-size: 1rem;
          border: 1.5px solid #ccc;
          border-radius: 6px;
          margin-top: 0.3rem;
          transition: border-color 0.3s ease;
        }
        input[type="text"]:focus,
        input[type="date"]:focus {
          border-color: #3498db;
          outline: none;
        }
        .input-error {
          border-color: #e74c3c !important;
        }
        .error {
          color: #e74c3c;
          font-size: 0.85rem;
          margin-top: 0.2rem;
        }
        .buttons {
          flex: 1 1 100%;
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }
        .btn {
          padding: 0.6rem 1.2rem;
          font-size: 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.3s ease;
          color: white;
          user-select: none;
        }
        .btn.add {
          background-color: #27ae60;
        }
        .btn.add:hover {
          background-color: #219150;
        }
        .btn.update {
          background-color: #2980b9;
        }
        .btn.update:hover {
          background-color: #1f6391;
        }
        .btn.cancel {
          background-color: #7f8c8d;
        }
        .btn.cancel:hover {
          background-color: #626f70;
        }
        .events-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .event-card {
          background: #ecf0f1;
          padding: 1rem 1.2rem;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: box-shadow 0.3s ease;
        }
        .event-card:hover {
          box-shadow: 0 6px 15px rgba(0,0,0,0.1);
        }
        .event-info h3 {
          margin: 0 0 0.3rem 0;
          color: #2c3e50;
        }
        .event-info p {
          margin: 0;
          color: #7f8c8d;
          font-size: 0.9rem;
        }
        .actions {
          display: flex;
          gap: 0.5rem;
        }
        .btn.edit {
          background-color: #f39c12;
        }
        .btn.edit:hover {
          background-color: #d78c0c;
        }
        .btn.delete {
          background-color: #e74c3c;
        }
        .btn.delete:hover {
          background-color: #c0392b;
        }
        .loading,
        .no-events {
          text-align: center;
          color: #95a5a6;
          font-style: italic;
          margin-top: 2rem;
        }

        /* Responsive */
        @media (max-width: 600px) {
          .form {
            flex-direction: column;
          }
          label {
            flex: 1 1 100%;
          }
          .buttons {
            flex-direction: column;
          }
          .btn {
            width: 100%;
          }
          .events-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default EventsList;
