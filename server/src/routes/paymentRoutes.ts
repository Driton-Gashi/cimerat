import express from 'express';
import {
   getAllPaymentsController,
   getPaymentByIdController,
   createNewPaymentController,
} from '../controllers/paymentController';

const router = express.Router();

router.get('/', getAllPaymentsController);

router.get('/:id', getPaymentByIdController);

router.post('/', createNewPaymentController);

export default router;
