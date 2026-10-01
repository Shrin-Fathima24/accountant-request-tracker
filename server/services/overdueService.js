import Request from '../models/Request.js';

// Compare UTC calendar days so time-of-day cannot make a request due today overdue.
export function getOverdueRequests(requests, now = new Date()) {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return requests
    .filter((request) => request.status !== 'Completed' && new Date(request.dueDate).getTime() < today)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .map((request) => ({ ...(request.toObject?.() ?? request), daysOverdue: Math.floor((today - Date.UTC(new Date(request.dueDate).getUTCFullYear(), new Date(request.dueDate).getUTCMonth(), new Date(request.dueDate).getUTCDate())) / 86400000) }));
}

export async function findOverdueRequests(now = new Date()) {
  const requests = await Request.find({ status: { $ne: 'Completed' } }).sort({ dueDate: 1 });
  return getOverdueRequests(requests, now);
}
