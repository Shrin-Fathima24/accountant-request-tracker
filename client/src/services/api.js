const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'The request failed');
  return result.data;
}

export const getRequests = () => request('/requests');
export const createRequest = (formData) => request('/requests', { method: 'POST', body: JSON.stringify(formData) });
export const updateRequestStatus = (id, status) => request(`/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const getOverdueRequests = () => request('/requests/overdue');
export const getReminders = () => request('/reminders');
