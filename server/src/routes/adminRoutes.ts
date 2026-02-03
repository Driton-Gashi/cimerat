import express from 'express';
import { getAllApartmentsAdminController, getApartmentByIdAdminController } from '../controllers/adminController';
import { requireAuth } from '../middleware/auth';
import { requirePlatformAdmin } from '../middleware/auth';

const router = express.Router();

router.use(requireAuth, requirePlatformAdmin);

router.get('/apartments', getAllApartmentsAdminController);
router.get('/apartments/:id', getApartmentByIdAdminController);

export default router;
