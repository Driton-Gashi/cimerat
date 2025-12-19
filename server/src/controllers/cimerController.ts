import type { Request, Response } from 'express';
import { getCimerByEmail, getAllCimers, getCimerById } from '../models/cimerModel';

export const getCimerUsingEmail = async (req: Request, res: Response) => {
   const email = req.query.email as string;
   try {
      if (!email) {
         return res.status(400).json({
            message:
               'Email is missing as a parameter try /api/cimer?email=dritongashi1995@gmail.com',
         });
      }
      const cimeri = await getCimerByEmail(email);
      if (cimeri) {
         return res.status(200).json(cimeri);
      }

      res.status(400).json({
         message: 'Theres no Cimera with this email',
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
         return res.status(400).json({
            message: 'Theres no cimera on the database right now',
         });
      }
      return res.status(200).json(cimerat);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
   }
};

export const getCimerFromID = async (req: Request, res: Response) => {
   const id = parseInt(req.params.id as string);
   const cimer = await getCimerById(id);
   try {
      if (!cimer) {
         return res.status(400).json({
            message: 'Theres no cimer with this ID currently!',
         });
      }
      return res.status(200).json(cimer);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
   }
};
