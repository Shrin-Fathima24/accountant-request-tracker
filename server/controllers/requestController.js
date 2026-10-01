import mongoose from 'mongoose';
import Request, { REQUEST_STATUSES } from '../models/Request.js';
import { findOverdueRequests } from '../services/overdueService.js';

const requiredFields = ['title', 'clientName', 'assignee', 'dueDate', 'status'];

export async function createRequest(req, res, next) {
  try {
    const missing = requiredFields.filter((field) => req.body[field] === undefined || String(req.body[field]).trim() === '');
    if (missing.length) return res.status(400).json({ success: false, message: `Required fields: ${missing.join(', ')}` });
    if (!REQUEST_STATUSES.includes(req.body.status)) return res.status(400).json({ success: false, message: 'Invalid status' });
    if (Number.isNaN(Date.parse(req.body.dueDate))) return res.status(400).json({ success: false, message: 'Invalid dueDate' });
    const request = await Request.create(req.body);
    return res.status(201).json({ success: true, data: request });
  } catch (error) { return next(error); }
}

export async function listRequests(req, res, next) {
  try {
    const requests = await Request.find().sort({ dueDate: 1 });
    return res.json({ success: true, count: requests.length, data: requests });
  } catch (error) { return next(error); }
}

export async function updateRequestStatus(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid request ID' });
    if (!REQUEST_STATUSES.includes(req.body.status)) return res.status(400).json({ success: false, message: 'Invalid status' });
    const request = await Request.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    return res.json({ success: true, data: request });
  } catch (error) { return next(error); }
}

export async function listOverdueRequests(req, res, next) {
  try { const data = await findOverdueRequests(); return res.json({ success: true, count: data.length, data }); }
  catch (error) { return next(error); }
}
