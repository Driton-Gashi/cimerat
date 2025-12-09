import express from 'express';
import dotenv from 'dotenv';
import cimerRoute from './routes/cimerRoutes';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/', cimerRoute);

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
   console.log('Server runing in port: ' + PORT);
});
