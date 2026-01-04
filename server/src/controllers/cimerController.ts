import type { Request, Response } from 'express';
import { getCimerByEmailModel, getAllCimersModel, getCimerByIdModel } from '../models/cimerModel';

export const getCimerByEmailController = async (req: Request, res: Response) => {
   try {
      const email = req.query.email as string;

      if (!email) {
         return res.status(400).json({
            message: 'Email query parameter is required.',
            example: '/cimerat/by-email?email=dritongashi1995@gmail.com',
         });
      }

      const cimer = await getCimerByEmailModel(email);

      if (!cimer) {
         return res.status(404).json({
            message: 'No cimer found with this email.',
         });
      }

      return res.status(200).json(cimer);
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error.' });
   }
};

export const getAllCimersController = async (_req: Request, res: Response) => {
   try {
      const cimers = await getAllCimersModel();

      if (!cimers || cimers.length === 0) {
         return res.status(404).json({
            message: 'No cimers found.',
         });
      }

      return res.status(200).json(cimers);
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error.', devLog: error });
   }
};

export const getCimerByIdController = async (req: Request, res: Response) => {
   try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
         return res.status(400).json({
            message: 'Invalid cimer ID.',
         });
      }

      const cimer = await getCimerByIdModel(id);

      if (!cimer) {
         return res.status(404).json({
            message: 'No cimer found with this ID.',
         });
      }

      return res.status(200).json(cimer);
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error.', devLog: error });
   }
};
