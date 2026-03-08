import { fetchWithTimeout, authHeaders } from "./utilityService";

const API = '/api/auth';

export const registerUser = async (name, email, password) => {
  return fetchWithTimeout(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
};

export const loginUser = async (email, password) => {
  return fetchWithTimeout(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
};

export const getProfile = async (token) => {
  return fetchWithTimeout(`${API}/me`, {
    method: 'GET',
    headers: authHeaders(token),
  });
};

export const updateProfileImage = async (file, token) => {
  const formData = new FormData();
  formData.append('image', file);
  return fetchWithTimeout(`${API}/profile/image`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
};

export const updateName = async (name, token) => {
  return fetchWithTimeout(`${API}/profile/name`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ name }),
  });
};

export const deleteAccount = async (token) => {
  return fetchWithTimeout(`${API}/profile`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
};
