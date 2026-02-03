import express from 'express';
import {
   signupController,
   loginController,
   getMeController,
   patchCurrentApartmentController,
} from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/me', requireAuth, getMeController);
router.patch('/me/current-apartment', requireAuth, patchCurrentApartmentController);

export default router;
