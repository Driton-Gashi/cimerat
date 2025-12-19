import type { Request, Response } from 'express';
import { getAllPaymentsModel, getPaymentByIdModel } from '../models/paymentModel';

export const getAllPaymentsController = async (_req: Request, res: Response) => {
   try {
      const payments = await getAllPaymentsModel();

      if (payments.length === 0) {
         return res.status(404).json({
            message: 'No payments found.',
         });
      }

      return res.status(200).json(payments);
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error.', devLog: error });
   }
};

export const getPaymentsByIdController = async (req: Request, res: Response) => {
   try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
         return res.status(400).json({
            message: 'Invalid payment ID.',
         });
      }

      const payment = await getPaymentByIdModel(id);

      if (!payment.length) {
         return res.status(404).json({
            message: 'No payment found with this ID.',
         });
      }

      return res.status(200).json(payment);
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error.', devLog: error });
   }
};
