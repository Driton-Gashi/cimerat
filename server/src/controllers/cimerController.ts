import type { Request, Response } from 'express';
import { getCimerByEmail, getAllCimers } from '../models/cimerModel';

export const getCimer = async (req: Request, res: Response) => {
   const email = req.query.email as string;
   try {
      if (!email) {
         return res.status(400).json({ message: 'Email duhet te shtohet si parameter.' });
      }
      const cimeri = await getCimerByEmail(email);
      if (cimeri) {
         return res.status(400).json(cimeri);
      }

      res.status(201).json({
         message: 'nuk ka cimera te regjistruar per momentin',
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
   }
};

export const getAllCimerat = async (req: Request, res: Response) => {
   const cimerat = await getAllCimers();
   try {
      if (!cimerat) {
         return res.status(201).json({
            message: 'nuk ka cimera te regjistruar per momentin',
         });
      }
      return res.status(400).json(cimerat);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
   }
};
