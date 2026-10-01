import { Router } from 'express';
import Reminder from '../models/Reminder.js';

const router = Router();
router.get('/', async (req, res, next) => {
  try { const data = await Reminder.find().populate('requestId', 'title clientName').sort({ reminderDate: -1 }); res.json({ success: true, count: data.length, data }); }
  catch (error) { next(error); }
});
export default router;
