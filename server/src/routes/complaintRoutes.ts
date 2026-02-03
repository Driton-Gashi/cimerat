import express from 'express';
import {
   createNewComplaintController,
   deleteComplaintByIdController,
   getAllComplaintsController,
   getComplaintByIdController,
} from '../controllers/complaintController';
import { requireAuth } from '../middleware/auth';
import { requireApartment } from '../middleware/auth';

const router = express.Router();

router.use(requireAuth, requireApartment);

router.get('/', getAllComplaintsController);
router.get('/:id', getComplaintByIdController);
router.post('/', createNewComplaintController);
router.delete('/:id', deleteComplaintByIdController);

export default router;
