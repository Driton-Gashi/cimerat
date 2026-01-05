import type { Request, Response } from 'express';
import {
   getAllPaymentsModel,
   getPaymentByIdModel,
   createPaymentModel,
} from '../models/paymentModel';

const serverError = (res: Response) => res.status(500).json({ message: 'Server error.' });

export const getAllPaymentsController = async (_req: Request, res: Response) => {
   try {
      const payments = await getAllPaymentsModel();
      // Return [] when empty (correct for collections)
      return res.status(200).json(payments);
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const getPaymentByIdController = async (req: Request, res: Response) => {
   try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
         return res.status(400).json({ message: 'Invalid payment ID.' });
      }

      const payment = await getPaymentByIdModel(id);

      if (!payment) {
         return res.status(404).json({ message: 'Payment not found.' });
      }

      return res.status(200).json(payment);
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const createNewPaymentController = async (req: Request, res: Response) => {
   try {
      const { category, name, date, payer_id, amount } = req.body;

      if (!category || !name || !date || payer_id == null || amount == null) {
         return res.status(400).json({ message: 'Missing required fields.' });
      }

      const payerIdNum = Number(payer_id);
      const amountNum = Number(amount);
      const dateObj = new Date(date);

      if (!Number.isInteger(payerIdNum) || payerIdNum <= 0) {
         return res.status(400).json({ message: 'Invalid payer_id.' });
      }

      if (!Number.isFinite(amountNum)) {
         return res.status(400).json({ message: 'Invalid amount.' });
      }

      if (Number.isNaN(dateObj.getTime())) {
         return res.status(400).json({ message: 'Invalid date.' });
      }

      const result = await createPaymentModel(category, name, dateObj, payerIdNum, amountNum);

      const createdPayment = await getPaymentByIdModel(Number(result.insertId));

      return res.status(201).json({
         message: `${name} - ${amountNum}€ was added successfully`,
         createdPayment,
      });
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};
