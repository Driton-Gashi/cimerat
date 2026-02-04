import type { Request, Response } from 'express';
import {
   getAllApartmentsForAdminModel,
   getApartmentByIdModel,
   getApartmentMembersModel,
   deleteApartmentModel,
   removeApartmentMemberModel,
   addMemberEnforcingSingleApartmentModel,
   reassignOrDeleteApartmentsCreatedByModel,
   countAllApartmentMembersModel,
} from '../models/apartmentModel';
import {
   getCimerByIdModel,
   getCimerByEmailModel,
   getAllCimersWithApartmentModel,
   deleteCimerByIdModel,
   countUserReferencesModel,
} from '../models/cimerModel';
import { clearCurrentApartmentIfModel } from '../models/authModel';
import {
   countAllPaymentsModel,
   countAllPaymentsUnpaidModel,
   countPaymentsThisWeekModel,
} from '../models/paymentModel';
import { countAllLoansModel, countAllLoansUnpaidModel } from '../models/loanModel';
import { countAllComplaintsModel } from '../models/complaintModel';

const serverError = (res: Response) => res.status(500).json({ message: 'Server error.' });

export const getDashboardStatsAdminController = async (_req: Request, res: Response) => {
   try {
      const [
         totalMembers,
         totalPayments,
         unpaidPayments,
         paymentsThisWeek,
         totalLoans,
         unpaidLoans,
         totalComplaints,
      ] = await Promise.all([
         countAllApartmentMembersModel(),
         countAllPaymentsModel(),
         countAllPaymentsUnpaidModel(),
         countPaymentsThisWeekModel(),
         countAllLoansModel(),
         countAllLoansUnpaidModel(),
         countAllComplaintsModel(),
      ]);
      return res.status(200).json({
         totalMembers,
         totalPayments,
         unpaidPayments,
         paymentsThisWeek,
         totalLoans,
         unpaidLoans,
         totalComplaints,
      });
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const getAllApartmentsAdminController = async (_req: Request, res: Response) => {
   try {
      const apartments = await getAllApartmentsForAdminModel();
      return res.status(200).json(apartments);
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const getApartmentByIdAdminController = async (req: Request, res: Response) => {
   try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
         return res.status(400).json({ message: 'Invalid apartment ID.' });
      }
      const apartment = await getApartmentByIdModel(id);
      if (!apartment) {
         return res.status(404).json({ message: 'Apartment not found.' });
      }
      const members = await getApartmentMembersModel(id);
      return res.status(200).json({ ...apartment, members });
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const deleteApartmentAdminController = async (req: Request, res: Response) => {
   try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
         return res.status(400).json({ message: 'Invalid apartment ID.' });
      }
      const apartment = await getApartmentByIdModel(id);
      if (!apartment) {
         return res.status(404).json({ message: 'Apartment not found.' });
      }
      await deleteApartmentModel(id);
      return res.status(200).json({ message: 'Apartment deleted.' });
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const removeMemberAdminController = async (req: Request, res: Response) => {
   try {
      const apartmentId = Number(req.params.id);
      const userId = Number(req.params.userId);
      if (
         !Number.isInteger(apartmentId) ||
         apartmentId <= 0 ||
         !Number.isInteger(userId) ||
         userId <= 0
      ) {
         return res.status(400).json({ message: 'Invalid apartment or user ID.' });
      }
      const apartment = await getApartmentByIdModel(apartmentId);
      if (!apartment) {
         return res.status(404).json({ message: 'Apartment not found.' });
      }
      await removeApartmentMemberModel(apartmentId, userId);
      await clearCurrentApartmentIfModel(userId, apartmentId);
      return res.status(200).json({ message: 'Member removed from apartment.' });
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const addMemberAdminController = async (req: Request, res: Response) => {
   try {
      const apartmentId = Number(req.params.id);
      if (!Number.isInteger(apartmentId) || apartmentId <= 0) {
         return res.status(400).json({ message: 'Invalid apartment ID.' });
      }
      const apartment = await getApartmentByIdModel(apartmentId);
      if (!apartment) {
         return res.status(404).json({ message: 'Apartment not found.' });
      }
      const { user_id, email } = req.body;
      let userId: number;
      if (user_id != null && Number.isInteger(Number(user_id))) {
         userId = Number(user_id);
      } else if (typeof email === 'string' && email.trim()) {
         const cimer = await getCimerByEmailModel(email.trim().toLowerCase());
         if (!cimer) {
            return res.status(404).json({ message: 'No account found with this email.' });
         }
         userId = cimer.id;
      } else {
         return res.status(400).json({ message: 'Provide user_id or email.' });
      }
      const user = await getCimerByIdModel(userId);
      if (!user) {
         return res.status(404).json({ message: 'User not found.' });
      }
      await addMemberEnforcingSingleApartmentModel(apartmentId, userId, 'member');
      const members = await getApartmentMembersModel(apartmentId);
      return res
         .status(201)
         .json({
            message:
               'Member added. An account can only be in one apartment; they were removed from any other.',
            members,
         });
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const getAllCimersAdminController = async (_req: Request, res: Response) => {
   try {
      const list = await getAllCimersWithApartmentModel();
      return res.status(200).json(list);
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const deleteCimerAdminController = async (req: Request, res: Response) => {
   try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
         return res.status(400).json({ message: 'Invalid user ID.' });
      }
      const user = await getCimerByIdModel(id);
      if (!user) {
         return res.status(404).json({ message: 'User not found.' });
      }
      const refs = await countUserReferencesModel(id);
      if (refs.payments > 0 || refs.loans > 0 || refs.complaints > 0) {
         return res.status(400).json({
            message:
               'Cannot delete user: they have payments, loans or complaints. Remove or reassign those first.',
            refs,
         });
      }
      await reassignOrDeleteApartmentsCreatedByModel(id);
      await deleteCimerByIdModel(id);
      return res.status(200).json({ message: 'User deleted.' });
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};
