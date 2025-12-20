import express from 'express';
import {
   getAllPaymentsController,
   getPaymentsByIdController,
   createNewPaymentController
} from '../controllers/paymentController';

const router = express.Router();

router.get('/', getAllPaymentsController);

router.get('/:id', getPaymentsByIdController);

router.post("/", createNewPaymentController);

export default router;
