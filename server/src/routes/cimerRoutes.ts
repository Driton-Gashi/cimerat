import express from 'express';
import {
   getAllCimersController,
   getCimerByEmailController,
   getCimerByIdController,
} from '../controllers/cimerController';

const router = express.Router();

router.get('/', getAllCimersController);

router.get('/by-email', getCimerByEmailController);

router.get('/:id', getCimerByIdController);

export default router;
