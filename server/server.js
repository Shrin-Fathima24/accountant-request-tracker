import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/db.js';
import requestRoutes from './routes/requestRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import { startOverdueJob } from './jobs/overdueJob.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ success: true, message: 'API is running' }));
app.use('/api/requests', requestRoutes);
app.use('/api/reminders', reminderRoutes);
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((error, req, res, next) => {
  console.error(error);
  if (error.name === 'ValidationError' || error.name === 'CastError') return res.status(400).json({ success: false, message: error.message });
  res.status(500).json({ success: false, message: 'A server error occurred' });
});

const port = process.env.PORT || 5000;
try {
  await connectDatabase();
  startOverdueJob();
  app.listen(port, () => console.log(`Server listening on port ${port}`));
} catch (error) {
  console.error('Could not start server:', error.message);
  process.exit(1);
}
