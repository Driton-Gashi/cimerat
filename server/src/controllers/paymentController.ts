import type { Request, Response } from 'express';
import { getAllPayments, getPaymentById } from '../models/paymentModel';

export const getPayments = async (req: Request, res: Response) => {
   try {
      const payments = await getAllPayments();
      if (!payments) {
         return res.status(201).json({
            message: 'No Payments were found on the Database',
         });
      }
      res.status(200).json(payments);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
   }
};

export const getSpecificPayment = async (req: Request, res: Response) => {
   const id = parseInt(req.query.id as string);

   const payments = await getPaymentById(id);
   try {
      if (!payments) {
         return res.status(400).json({
            message: 'There no Payments with this id',
         });
      }
      return res.status(200).json(payments);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
   }
};
