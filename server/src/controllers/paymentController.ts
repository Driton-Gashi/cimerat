import type { Request, Response } from 'express';
import {
   getAllPaymentsModel,
   getPaymentByIdModel,
   createPaymentModel,
} from '../models/paymentModel';

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
      if (!payment) {
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

export const createNewPaymentController = async (req: Request, res: Response) => {
   const { category, name, date, payer_id, amount } = req.body;
   try {
      const result = await createPaymentModel(category, name, new Date(date), payer_id, amount);
      let createdPayment = await getPaymentByIdModel(Number(result.insertId));
      res.status(200).json({
         message: `${name} - ${amount}€ was added successfully`,
         createdPayment,
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
   }
};
