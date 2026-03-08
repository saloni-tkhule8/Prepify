import { fetchAI, authHeaders } from './utilityService';

const API = '/api/sessions';

export const saveInterviewSession = (config, questions, results, token) =>
  fetchAI(API, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ config, questions, results }),
  });

export const getInterviewSessions = (token) =>
  fetchAI(API, {
    method: 'GET',
    headers: authHeaders(token),
  });