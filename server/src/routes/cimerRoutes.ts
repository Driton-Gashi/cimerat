import express from 'express';
import { getCimerUsingEmail, getAllCimerat, getCimerFromID } from '../controllers/cimerController';

const router = express.Router();

router.get('/cimer', getCimerUsingEmail);
router.get('/cimer/:id', getCimerFromID);
router.get('/cimerat/all', getAllCimerat);

export default router;
