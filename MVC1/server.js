import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './route/userRoutes.js';
import bcrypt from 'bcrypt';
console.log(bcrypt.hashSync('admin123', 10));
dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));