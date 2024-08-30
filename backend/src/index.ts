import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import measureRoutes from './routes/measureRoutes';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send({
    success: true,
    statusCode: 200,
    body: 'Welcome to the Shopper API!'
  });
});

app.use('/api', measureRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
