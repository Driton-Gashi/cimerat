import type { Request, Response } from 'express';
import { getAllLoansModel, getLoanByIdModel, createLoanModel } from '../models/loanModel';
import type { AuthUser } from '../middleware/auth';

const serverError = (res: Response) => res.status(500).json({ message: 'Server error.' });

export const getAllLoansController = async (req: Request, res: Response) => {
   try {
      const currentApartmentId = (req as any).currentApartmentId as number;
      const loans = await getAllLoansModel(currentApartmentId);
      return res.status(200).json(loans);
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const getLoanByIdController = async (req: Request, res: Response) => {
   try {
      const user = (req as any).user as AuthUser;
      const currentApartmentId = (req as any).currentApartmentId as number;
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
         return res.status(400).json({ message: 'Invalid loan ID.' });
      }
      const loan = await getLoanByIdModel(id);
      if (!loan) {
         return res.status(404).json({ message: 'Loan not found.' });
      }
      if (loan.apartment_id !== currentApartmentId && user.global_role !== 'platform_admin') {
         return res.status(403).json({ message: 'Access denied.' });
      }
      return res.status(200).json(loan);
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const createNewLoanController = async (req: Request, res: Response) => {
   try {
      const user = (req as any).user as AuthUser;
      const currentApartmentId = (req as any).currentApartmentId as number;
      const { name, loan_date, loaner_id, loanee_id, amount } = req.body;
      if (!name || !loan_date || loaner_id == null || loanee_id == null || amount == null) {
         return res.status(400).json({ message: 'Missing required fields.' });
      }
      const loanerIdNum = Number(loaner_id);
      const loaneeIdNum = Number(loanee_id);
      const amountNum = Number(amount);
      const dateObj = new Date(loan_date);
      if (!Number.isInteger(loanerIdNum) || loanerIdNum <= 0) {
         return res.status(400).json({ message: 'Invalid loaner_id.' });
      }
      if (!Number.isInteger(loaneeIdNum) || loaneeIdNum <= 0) {
         return res.status(400).json({ message: 'Invalid loanee_id.' });
      }
      if (loanerIdNum === loaneeIdNum) {
         return res.status(400).json({ message: 'Loaner and loanee cannot be the same person.' });
      }
      if (!Number.isFinite(amountNum)) {
         return res.status(400).json({ message: 'Invalid amount.' });
      }
      if (Number.isNaN(dateObj.getTime())) {
         return res.status(400).json({ message: 'Invalid date.' });
      }
      const result = await createLoanModel(
         name,
         dateObj,
         loanerIdNum,
         loaneeIdNum,
         amountNum,
         currentApartmentId,
         user.id,
      );
      const createdLoan = await getLoanByIdModel(Number(result.insertId));
      return res.status(201).json({
         message: `${name} - ${amountNum}€ was added successfully`,
         createdLoan,
      });
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};
