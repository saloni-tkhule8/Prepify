import { fetchAI, authHeaders } from "./utilityService";

export const analyzeResume = async (base64File, targetRole, token) => {
  return fetchAI('/api/ai/analyze-resume', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ base64File, targetRole }),
  });
};

export const generateRoadmap = async (role, level, targetLevel, timeline, token) => {
  return fetchAI('/api/ai/generate-roadmap', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ role, level, targetLevel, timeline }),
  });
};

export const genarateQuestions = async (role, level, topics = [], count, company = '', token) =>
  fetchAI('/api/ai/generate-questions', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ role, level, topics, count, company }),
  });

export const evaluateAnswer = async (question, answer, role, token) => {
  return fetchAI('/api/ai/evaluate-answer', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ question, answer, role }),
  });
};
