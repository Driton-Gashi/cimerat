import express from 'express';
import {
   getAllLoansController,
   getLoanByIdController,
   createNewLoanController,
} from '../controllers/loanController';

const router = express.Router();

router.get('/', getAllLoansController);

router.get('/:id', getLoanByIdController);

router.post('/', createNewLoanController);

export default router;
