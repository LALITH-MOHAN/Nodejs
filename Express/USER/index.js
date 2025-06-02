import express from 'express';
import router from './route.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// All defined routes
app.get('/', (req, res) => res.send("HELLO FROM SERVER"));
app.use('/user', router);


app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`);
});
