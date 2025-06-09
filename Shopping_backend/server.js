import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});