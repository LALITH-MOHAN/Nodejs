import express from 'express';
import cors from 'cors';
import router from './routes/productRoutes.js';
import authRouter from './routes/authRoutes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use('/api/products', router);
app.use('/api/auth', authRouter);

export default app;