import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import cimerRoute from './routes/cimerRoutes';
import paymentRoute from './routes/paymentRoutes';
import complaintRoute from './routes/complaintRoutes';
import loanRoute from './routes/loanRoutes';

dotenv.config();

const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://cimerat.dritongashi.com'];

app.use(
   cors({
      origin: allowedOrigins,
      credentials: true,
   }),
);

app.use(express.json());

app.get('/', (req, res) => {
   const baseUrl = `${req.protocol}://${req.get('host')}`;

   res.status(200).json({
      message: 'Welcome to the Cimerat API',
      docs: `${baseUrl}/docs`,
   });
});

app.get('/docs', (req, res) => {
   const baseUrl = `${req.protocol}://${req.get('host')}`;

   res.status(200).json({
      cimerat: {
         getAll: `${baseUrl}/cimerat`,
         getById: `${baseUrl}/cimerat/:id`,
         getByEmail: `${baseUrl}/cimerat/by-email?email=dritongashi1995@gmail.com`,
      },
      payments: {
         getAll: `${baseUrl}/payments`,
         getById: `${baseUrl}/payments/:id`,
         create: `${baseUrl}/payments`,
      },
      complaints: {
         getAll: `${baseUrl}/complaints`,
         getById: `${baseUrl}/complaints/:id`,
         create: `${baseUrl}/complaints`,
         delete: `${baseUrl}/complaints/:id`,
      },
      loans: {
         getAll: `${baseUrl}/loans`,
         getById: `${baseUrl}/loans/:id`,
         create: `${baseUrl}/loans`,
      },
   });
});

app.use('/cimerat', cimerRoute);
app.use('/payments', paymentRoute);
app.use('/complaints', complaintRoute);
app.use('/loans', loanRoute);

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
   console.log(`🚀 Server running on port ${PORT}`);
});
