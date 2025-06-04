import express from 'express';
import cors from 'cors';
import userRoutes from './route/userRoutes.js';

const app = express();

// Middleware
app.use(cors()); // Enables CORS for all origins (safe for dev)
app.use(express.json());

// Routes
app.use('/api', userRoutes);

// Start server
app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
