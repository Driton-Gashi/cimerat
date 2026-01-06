import express from 'express';
import {
   createNewComplaintController,
   deleteComplaintByIdController,
   getAllComplaintsController,
   getComplaintByIdController,
} from '../controllers/complaintController';

const router = express.Router();

router.get('/', getAllComplaintsController);

router.get('/:id', getComplaintByIdController);

router.post('/', createNewComplaintController);

router.delete('/:id', deleteComplaintByIdController);

export default router;
