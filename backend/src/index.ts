import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import classRoutes from './routes/classes.routes';
import studentRoutes from './routes/students.routes';
import assignmentRoutes from './routes/assignments.routes';
import inviteRoutes from './routes/invites.routes';
import userRoutes from './routes/users.routes';
import statsRoutes from './routes/stats.routes';
import importRoutes from './routes/import.routes';
import schoolRoutes from './routes/school.routes';
import reportsRoutes from './routes/reports.routes';
import billingRoutes from './routes/billing.routes';
import notificationsRoutes from './routes/notifications.routes';
import gamesRoutes from './routes/games.routes';
import libraryRoutes from './routes/library.routes';
import studentPortalRoutes from './routes/student.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for CSV uploads

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/import', importRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/student', studentPortalRoutes);  // Student Portal routes


app.get('/', (req, res) => {
  res.send('Bloomncuddles API is running');
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
