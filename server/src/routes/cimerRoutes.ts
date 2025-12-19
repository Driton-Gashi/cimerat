import express from 'express';
import { getCimer, getAllCimerat } from '../controllers/cimerController';

const router = express.Router();

router.get('/cimer', getCimer);
router.get('/cimerat/all', getAllCimerat);

export default router;
