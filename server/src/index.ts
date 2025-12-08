import app from './server';
import dotenv from 'dotenv';

dotenv.config();

app.listen(process.env.PORT ?? 5000, () => {
   console.log('Server runing in port: ' + process.env.PORT || 5000);
});
