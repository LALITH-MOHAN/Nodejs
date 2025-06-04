import express from 'express';
import { getGreeting } from './greet.js';

const app = express();

app.get('/greet', (req, res) => {
  const name = req.query.name;
  res.json({ message: getGreeting(name) });
});

export default app;
