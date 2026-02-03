import express from 'express';
import {
   getAllApartmentsAdminController,
   getApartmentByIdAdminController,
   deleteApartmentAdminController,
   removeMemberAdminController,
   addMemberAdminController,
   getAllCimersAdminController,
   deleteCimerAdminController,
} from '../controllers/adminController';
import { requireAuth } from '../middleware/auth';
import { requirePlatformAdmin } from '../middleware/auth';

const router = express.Router();

router.use(requireAuth, requirePlatformAdmin);

router.get('/apartments', getAllApartmentsAdminController);
router.get('/apartments/:id', getApartmentByIdAdminController);
router.delete('/apartments/:id', deleteApartmentAdminController);
router.delete('/apartments/:id/members/:userId', removeMemberAdminController);
router.post('/apartments/:id/members', addMemberAdminController);

router.get('/cimerat', getAllCimersAdminController);
router.delete('/cimerat/:id', deleteCimerAdminController);

export default router;
