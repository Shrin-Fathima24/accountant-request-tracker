import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  reminderDay: { type: String, required: true },
  message: { type: String, required: true },
  reminderDate: { type: Date, default: Date.now }
}, { timestamps: { createdAt: true, updatedAt: false } });

reminderSchema.index({ requestId: 1, reminderDay: 1 }, { unique: true });

export default mongoose.model('Reminder', reminderSchema);
