import mongoose from 'mongoose';

export const REQUEST_STATUSES = ['Open', 'In Progress', 'Completed'];

const requestSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  clientName: { type: String, required: true, trim: true },
  assignee: { type: String, required: true, trim: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: REQUEST_STATUSES, required: true }
}, { timestamps: true });

export default mongoose.model('Request', requestSchema);
