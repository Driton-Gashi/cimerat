import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.listen(process.env.PORT || 5000, () => {
   console.log('Server runing in port: ' + process.env.PORT || 5000);
});

app.get('/', (req: Request, res: Response) => {
   res.send('Server is running just fine!');
});
