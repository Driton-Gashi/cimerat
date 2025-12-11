import express from 'express';
import { getCimer, getAllCimerat } from '../controllers/cimerController';

const router = express.Router();

router.get('/cimerat', getCimer);
router.get('/cimeratAll', getAllCimerat);

export default router;
