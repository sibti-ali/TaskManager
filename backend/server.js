import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';
import db from './config/db.js';

const app = express();

// Load environment variables
dotenv.config();

// Test DB connection
db.getConnection()
  .then(() => console.log('MySQL connected!'))
  .catch((err) => console.error('DB Connection Failed:', err));

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/tasks', taskRoutes);



// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
