import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import cimerRoute from './routes/cimerRoutes';
import paymentRoute from './routes/paymentRoutes';

dotenv.config();

const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://cimerat.dritongashi.com'];

app.use(
   cors({
      origin: allowedOrigins,
   }),
);

app.use(express.json());

app.get('/', (req, res) => {
   res.status(200).json({
      message: 'Welcome to our Cimerat API, got to /api to test our api',
   });
});

app.get('/api', (req, res) => {
   res.status(200).json({
      cimer: {
         getOne: 'GET /api/cimer?email=random@gmail.com',
         getAll: 'GET /api/cimerat/all',
      },
      payments: {
         getAll: 'GET /api/payments',
         getById: 'GET /api/payments?id=1',
         create: 'POST /api/payments/all',
      },
   });
});

app.use('/api/', cimerRoute);
app.use('/api/', paymentRoute);

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
   console.log('Server runing in port: ' + PORT);
});
