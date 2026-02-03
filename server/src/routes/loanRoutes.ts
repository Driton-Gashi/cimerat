import express from 'express';
import {
   getAllLoansController,
   getLoanByIdController,
   createNewLoanController,
} from '../controllers/loanController';
import { requireAuth } from '../middleware/auth';
import { requireApartment } from '../middleware/auth';

const router = express.Router();

router.use(requireAuth, requireApartment);

router.get('/', getAllLoansController);
router.get('/:id', getLoanByIdController);
router.post('/', createNewLoanController);

export default router;
