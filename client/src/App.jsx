import React, { useCallback, useEffect, useState } from 'react';
import { createRequest, getOverdueRequests, getReminders, getRequests, updateRequestStatus } from './services/api.js';

const statuses = ['Open', 'In Progress', 'Completed'];
const emptyForm = { title: '', clientName: '', assignee: '', dueDate: '', status: 'Open' };
const formatDate = (date) => new Date(date).toLocaleDateString();

function App() {
  const [requests, setRequests] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const refreshData = useCallback(async () => {
    setError('');
    try {
      const [requestData, overdueData, reminderData] = await Promise.all([getRequests(), getOverdueRequests(), getReminders()]);
      setRequests(requestData); setOverdue(overdueData); setReminders(reminderData);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refreshData(); const timer = setInterval(refreshData, 30000); return () => clearInterval(timer); }, [refreshData]);

  async function handleCreate(event) {
    event.preventDefault(); setSaving(true); setError('');
    try { await createRequest(form); setForm(emptyForm); await refreshData(); }
    catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function handleStatusChange(id, status) {
    setError('');
    try { await updateRequestStatus(id, status); await refreshData(); }
    catch (err) { setError(err.message); }
  }

  const counts = Object.fromEntries(statuses.map((status) => [status, requests.filter((item) => item.status === status).length]));

  return <main className="page-shell">
    <header className="page-header"><div><p className="eyebrow">WORK QUEUE</p><h1>Accountant Request Tracker</h1><p className="subtitle">Keep client work visible, on schedule, and easy to follow up.</p></div><button className="secondary-button" onClick={refreshData}>Refresh data</button></header>
    {error && <div className="error-banner" role="alert">{error}</div>}
    <section className="summary-grid" aria-label="Request summary">
      <SummaryCard label="Total Requests" value={requests.length} accent="navy" />
      <SummaryCard label="Open" value={counts.Open || 0} accent="blue" />
      <SummaryCard label="In Progress" value={counts['In Progress'] || 0} accent="gold" />
      <SummaryCard label="Completed" value={counts.Completed || 0} accent="green" />
      <SummaryCard label="Overdue" value={overdue.length} accent="red" />
    </section>
    <section className="panel create-panel"><div className="section-heading"><div><p className="eyebrow">NEW WORK</p><h2>Create a request</h2></div><span className="section-note">All fields are required</span></div>
      <form className="request-form" onSubmit={handleCreate}>
        <label>Request title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter request title" /></label>
        <label>Client name<input required value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="Enter client name" /></label>
        <label>Assignee<input required value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} placeholder="Enter assignee name" /></label>
        <label>Due date<input required type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></label>
        <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        <button className="primary-button" disabled={saving}>{saving ? 'Creating…' : 'Create Request'}</button>
      </form>
    </section>
    <section className="panel"><div className="section-heading"><div><p className="eyebrow">ALL WORK</p><h2>Requests</h2></div><span className="section-note">Sorted by due date</span></div>
      {loading ? <p className="empty-state">Loading requests…</p> : requests.length === 0 ? <p className="empty-state">No requests yet. Create one above to get started.</p> : <div className="table-wrap"><table><thead><tr><th>Title</th><th>Client</th><th>Assignee</th><th>Due date</th><th>Status</th><th>Actions</th></tr></thead><tbody>{requests.map((item) => <tr key={item._id}><td className="title-cell">{item.title}</td><td>{item.clientName}</td><td>{item.assignee}</td><td>{formatDate(item.dueDate)}</td><td><span className={`status-pill ${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span></td><td><select aria-label={`Update status for ${item.title}`} value={item.status} onChange={(e) => handleStatusChange(item._id, e.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div>}
    </section>
    <div className="bottom-grid">
      <section className="panel"><div className="section-heading"><div><p className="eyebrow">NEEDS ATTENTION</p><h2>Overdue requests</h2></div><span className="count-badge danger">{overdue.length}</span></div>
        {overdue.length === 0 ? <p className="empty-state">No active overdue requests.</p> : <div className="overdue-list">{overdue.map((item) => <article className="overdue-item" key={item._id}><div><strong>{item.title}</strong><p>{item.clientName} · {item.assignee}</p></div><div className="overdue-meta"><span>{item.daysOverdue} {item.daysOverdue === 1 ? 'day' : 'days'} overdue</span><small>Due {formatDate(item.dueDate)}</small></div></article>)}</div>}
      </section>
      <section className="panel"><div className="section-heading"><div><p className="eyebrow">AUTOMATION</p><h2>Reminders</h2></div><span className="count-badge">{reminders.length}</span></div>
        {reminders.length === 0 ? <p className="empty-state">Reminders appear here after the next scheduled check.</p> : <div className="reminder-list">{reminders.map((reminder) => <article className="reminder-item" key={reminder._id}><span className="reminder-dot" /><div><strong>{reminder.message}</strong><p>{new Date(reminder.reminderDate).toLocaleString()}</p></div></article>)}</div>}
      </section>
    </div>
    <footer>Accountant Request Tracker</footer>
  </main>;
}

function SummaryCard({ label, value, accent }) { return <article className={`summary-card ${accent}`}><span>{label}</span><strong>{value}</strong></article>; }

export default App;
