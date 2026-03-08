import { fetchWithTimeout } from "./utilityService";

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
