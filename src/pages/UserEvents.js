import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

const UserEvent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmedEvents, setConfirmedEvents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events`);
      if (!response.ok) throw new Error('Gagal memuat event');
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan saat mengambil data event.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSelectEvent = (event) => {
    if (isEventConfirmed(event.id)) {
      setSelectedEvent(event);
      setShowConfirmation(true);
      return;
    }
    setSelectedEvent(event);
    setShowConfirmation(true);
  };

  const isEventConfirmed = (eventId) => {
    return confirmedEvents.some(e => e.id === eventId);
  };

  const confirmSelection = () => {
    if (isEventConfirmed(selectedEvent.id)) {
      setConfirmedEvents(confirmedEvents.filter(e => e.id !== selectedEvent.id));
    } else {
      setConfirmedEvents([...confirmedEvents, selectedEvent]);
    }
    setShowConfirmation(false);
  };

  const cancelSelection = () => {
    setSelectedEvent(null);
    setShowConfirmation(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Styles
  const containerStyle = {
    background: 'linear-gradient(to right, #ff512f, #f09819)',
    minHeight: '100vh',
    padding: '40px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const cardContainerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    maxWidth: '1000px',
    margin: '0 auto',
    textAlign: 'center'
  };

  const cardStyle = (event) => ({
    backgroundColor: isEventConfirmed(event.id) ? '#e8f5e9' : 
                   selectedEvent?.id === event.id ? '#e3f2fd' : 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: isEventConfirmed(event.id) ? '2px solid #4caf50' : 
            selectedEvent?.id === event.id ? '2px solid #2196f3' : '2px solid transparent',
    overflow: 'hidden',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
    }
  });

  const imageContainerStyle = {
    height: '200px',
    overflow: 'hidden',
    borderRadius: '8px',
    marginBottom: '15px',
    position: 'relative',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  };

  const checkmarkStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#4caf50',
    color: 'white',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    zIndex: 1
  };

  return (
    <div style={containerStyle}>
      <div style={cardContainerStyle}>
        <h2 style={{ color: '#333', marginBottom: '5px' }}>Hai Pengguna!</h2>
        <h3 style={{ color: '#f44336', marginBottom: '30px', fontWeight: '600' }}>
          Daftar Event Tersedia
        </h3>

        {loading ? (
          <div style={{ margin: '20px 0' }}>
            <p>Memuat data event...</p>
            <div style={{
              border: '4px solid rgba(0,0,0,0.1)',
              borderRadius: '50%',
              borderTop: '4px solid #f44336',
              width: '30px',
              height: '30px',
              animation: 'spin 1s linear infinite',
              margin: '20px auto'
            }}></div>
          </div>
        ) : error ? (
          <p style={{ color: 'red', backgroundColor: '#ffeeee', padding: '10px', borderRadius: '5px' }}>
            {error}
          </p>
        ) : events.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>Belum ada event tersedia saat ini.</p>
        ) : (
          <div style={{ marginBottom: '30px' }}>
            {confirmedEvents.length > 0 && (
              <div style={{
                backgroundColor: '#e8f5e9',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                borderLeft: '5px solid #4caf50'
              }}>
                <p style={{ margin: 0, fontWeight: '500' }}>Anda terdaftar di {confirmedEvents.length} event:</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0 0' }}>
                  {confirmedEvents.map(event => (
                    <li key={event.id} style={{ marginBottom: '5px' }}>
                      • <strong>{event.name}</strong> ({new Date(event.date).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '25px',
              marginTop: '20px'
            }}>
              {events.map((event) => (
                <div key={event.id} onClick={() => handleSelectEvent(event)} style={cardStyle(event)}>
                  {isEventConfirmed(event.id) && <div style={checkmarkStyle}>✓</div>}
                  
                  
<div style={imageContainerStyle}>
  {event.image_path ? (
    <img 
      src={`http://localhost:5000/public${event.image_path}`}
      alt={event.name}
      style={imageStyle}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = '/placeholder.jpg';
        console.error('Gagal memuat gambar:', `http://localhost:5000/public${event.image_path}`);
      }}
    />
  ) : (
    <div style={{ color: '#999' }}>Tidak ada gambar</div>
  )}
</div>
                  
                  <h4 style={{
                    color: isEventConfirmed(event.id) ? '#2e7d32' : 
                          selectedEvent?.id === event.id ? '#2196f3' : '#333',
                    margin: '10px 0'
                  }}>
                    {event.name}
                  </h4>
                  
                  <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
                    <span style={{ marginRight: '8px' }}>📍</span>
                    <span>{event.location || 'Lokasi tidak tersedia'}</span>
                  </div>
                  
                  <p style={{ color: '#666', margin: '8px 0' }}>
                    <strong>Tanggal:</strong> {new Date(event.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  
                  {isEventConfirmed(event.id) && (
                    <div style={{
                      marginTop: '15px',
                      padding: '8px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      borderRadius: '5px',
                      textAlign: 'center'
                    }}>
                      Terdaftar
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#e53935',
            color: 'white',
            padding: '12px 25px',
            border: 'none',
            borderRadius: '30px',
            marginTop: '30px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            ':hover': {
              backgroundColor: '#c62828',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Logout
        </button>
      </div>

      {showConfirmation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#2196f3', marginBottom: '20px' }}>
              {isEventConfirmed(selectedEvent?.id) ? 'Batalkan Pendaftaran' : 'Konfirmasi Pendaftaran'}
            </h3>
            <p style={{ marginBottom: '25px' }}>
              {isEventConfirmed(selectedEvent?.id) 
                ? `Anda akan membatalkan pendaftaran untuk event:`
                : `Anda akan mendaftar untuk event:`} <br />
              <strong>{selectedEvent?.name}</strong>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button
                onClick={confirmSelection}
                style={{
                  backgroundColor: isEventConfirmed(selectedEvent?.id) ? '#f44336' : '#4caf50',
                  color: 'white',
                  padding: '10px 25px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  ':hover': {
                    backgroundColor: isEventConfirmed(selectedEvent?.id) ? '#d32f2f' : '#388e3c'
                  }
                }}
              >
                {isEventConfirmed(selectedEvent?.id) ? 'Ya, Batalkan' : 'Ya, Daftar'}
              </button>
              <button
                onClick={cancelSelection}
                style={{
                  backgroundColor: '#757575',
                  color: 'white',
                  padding: '10px 25px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  ':hover': {
                    backgroundColor: '#616161'
                  }
                }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserEvent;