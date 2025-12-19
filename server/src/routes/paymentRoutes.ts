import express from 'express';
import { getPayments, getSpecificPayment } from '../controllers/paymentController';

const router = express.Router();

router.get('/payment', getSpecificPayment);
router.get('/payments/all', getPayments);

export default router;
