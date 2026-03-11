export const fetchWithTimeout = async (url, options, timeout = 10000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal }); 
    clearTimeout(timer);

    const text = await res.text();
    if (!text) throw new Error('Server did not respond. Please try again.');

    return JSON.parse(text);
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Request timed out. Please try again.');
    if (err instanceof SyntaxError) throw new Error('Server error. Please try again.');
    throw err;
  }
};

const AI_TIMEOUT = 60000;

const BASE_URL = import.meta.env.VITE_API_URL || '';

export const fetchAI = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
      reject(new Error('Request timed out. Please try again.'));
    }, AI_TIMEOUT);

    fetch(`${BASE_URL}${url}`, { ...options, signal: controller.signal })
      .then(res => res.json())
      .then(data => { clearTimeout(timer); resolve(data); })
      .catch(err => { clearTimeout(timer); reject(err); });
  });
};

export const fetchWithBase = (url, options = {}) => {
  return fetchWithTimeout(`${BASE_URL}${url}`, options);
};

export const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});
