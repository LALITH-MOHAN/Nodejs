import express from 'express';
import cors from 'cors';
import router from './route/userRoutes.js';

const app = express();

// Enable CORS
app.use(cors());

app.use(express.json());
app.use('/users', router);

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000....");
});
