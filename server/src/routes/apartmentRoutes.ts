import express from 'express';
import {
   createApartmentController,
   getMyApartmentsController,
   getApartmentByIdController,
   getApartmentMembersController,
   removeMemberController,
} from '../controllers/apartmentController';
import { requireAuth } from '../middleware/auth';
import { requireApartmentAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/', requireAuth, createApartmentController);
router.get('/mine', requireAuth, getMyApartmentsController);
router.get('/:id', requireAuth, getApartmentByIdController);
router.get('/:id/members', requireAuth, getApartmentMembersController);
router.delete('/:id/members/:userId', requireAuth, requireApartmentAdmin('params', 'id'), removeMemberController);

export default router;
