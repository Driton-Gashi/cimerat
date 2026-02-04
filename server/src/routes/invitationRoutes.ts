import express from 'express';
import {
   createInvitationController,
   getInvitationByTokenController,
   acceptInvitationController,
} from '../controllers/invitationController';
import { requireAuth } from '../middleware/auth';
import { requireApartmentAdmin } from '../middleware/auth';

const router = express.Router();

router.post(
   '/',
   requireAuth,
   requireApartmentAdmin('body', 'apartment_id'),
   createInvitationController,
);
router.get('/accept/:token', getInvitationByTokenController);
router.post('/accept', requireAuth, acceptInvitationController);

export default router;
