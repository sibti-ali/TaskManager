import express from 'express';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';
import db from './config/db.js';
// security
import cors from 'cors';
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet';

// api documentation
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'API for managing tasks',
    },
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

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
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 400 }))//Use a custom ratelimiter (Set higher for testing purposes)
app.use(helmet());// Secure HTTP response headers
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));// Serve Swagger UI
app.use('/api/tasks', taskRoutes); // Use your task routes


// Routes
app.use('/api/tasks', taskRoutes);



// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
