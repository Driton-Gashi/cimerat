import express from 'express';
import { getCimer } from '../controllers/cimerController';

const router = express.Router();

router.get('/cimerat', getCimer);

export default router;
