const API_BASE_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const registerUser = async (username, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  return response.json();
};

const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchEvents = async () => {
  const response = await fetch(`${API_URL}/events`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Gagal memuat event');
  return await response.json();
};

export const addEvent = async (formData) => {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: getAuthHeaders(), // JANGAN set Content-Type untuk FormData
    body: formData // Langsung kirim FormData tanpa diubah ke JSON
  });
  if (!response.ok) throw new Error('Gagal menambah event');
  return await response.json();
};

export const updateEvent = async (id, formData) => {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: formData // Langsung kirim FormData
  });
  if (!response.ok) throw new Error('Gagal update event');
  return await response.json();
};

export const deleteEvent = async (id) => {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Gagal hapus event');
  return await response.json();
};
