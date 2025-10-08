const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const fetchStatus = async () => {
  const res = await fetch(`${API_BASE}/`);
  return await res.json();
};

export const fetchSentiment = async (text) => {
  const res = await fetch(`${API_BASE}/sentiment?text=${encodeURIComponent(text)}`);
  return await res.json();
};

export const fetchPrice = async (ticker) => {
  const res = await fetch(`${API_BASE}/price?ticker=${ticker}`);
  return await res.json();
};

export const fetchHistory = async (ticker, period = "1mo") => {
  const res = await fetch(`${API_BASE}/history?ticker=${ticker}&period=${period}`);
  return await res.json();
};

export const fetchHeadlines = async (market = "IN") => {
  const res = await fetch(`${API_BASE}/headlines?market=${market}`);
  return await res.json();
};
