import express from 'express';
import {
   getAllPaymentsController,
   getPaymentByIdController,
   createNewPaymentController,
} from '../controllers/paymentController';
import { requireAuth } from '../middleware/auth';
import { requireApartment } from '../middleware/auth';

const router = express.Router();

router.use(requireAuth, requireApartment);

router.get('/', getAllPaymentsController);
router.get('/:id', getPaymentByIdController);
router.post('/', createNewPaymentController);

export default router;
