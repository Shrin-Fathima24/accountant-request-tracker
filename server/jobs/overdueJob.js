import cron from 'node-cron';
import Reminder from '../models/Reminder.js';
import { findOverdueRequests } from '../services/overdueService.js';

export function startOverdueJob() {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const reminderDay = now.toISOString().slice(0, 10);
    try {
      const overdue = await findOverdueRequests(now);
      for (const request of overdue) {
        try {
          await Reminder.create({ requestId: request._id, reminderDay, message: `Overdue request: ${request.title} (${request.daysOverdue} day${request.daysOverdue === 1 ? '' : 's'} overdue)` });
          console.log(`Overdue reminder generated for request: ${request.title}`);
        } catch (error) {
          if (error.code !== 11000) throw error;
        }
      }
    } catch (error) { console.error('Overdue reminder job failed:', error.message); }
  });
  console.log('Overdue reminder job scheduled (every minute)');
}
