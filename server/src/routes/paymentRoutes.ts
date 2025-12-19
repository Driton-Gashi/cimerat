import express from 'express';
import {
   getAllPaymentsController,
   getPaymentsByIdController,
} from '../controllers/paymentController';

const router = express.Router();

router.get('/', getAllPaymentsController);

router.get('/:id', getPaymentsByIdController);

export default router;
