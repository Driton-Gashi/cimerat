import type { Request, Response } from 'express';
import {
   createApartmentModel,
   getApartmentByIdModel,
   getApartmentMembersModel,
   removeApartmentMemberModel,
   countAdminMembersModel,
   getMemberRoleModel,
} from '../models/apartmentModel';
import { setCurrentApartmentModel, getApartmentsForUserModel } from '../models/authModel';
import type { AuthUser } from '../middleware/auth';

const serverError = (res: Response) => res.status(500).json({ message: 'Server error.' });

export const createApartmentController = async (req: Request, res: Response) => {
   try {
      const user = (req as any).user as AuthUser;
      const { name } = req.body;
      if (!name || typeof name !== 'string' || !name.trim()) {
         return res.status(400).json({ message: 'Apartment name is required.' });
      }
      const { insertId } = await createApartmentModel(name.trim(), user.id);
      const apartment = await getApartmentByIdModel(insertId);
      const members = await getApartmentMembersModel(insertId);
      await setCurrentApartmentModel(user.id, insertId);
      return res.status(201).json({
         message: 'Apartment created.',
         apartment: { ...apartment, members },
         currentApartmentId: insertId,
      });
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const getMyApartmentsController = async (req: Request, res: Response) => {
   try {
      const user = (req as any).user as AuthUser;
      const apartments = await getApartmentsForUserModel(user.id);
      return res.status(200).json(apartments || []);
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const getApartmentByIdController = async (req: Request, res: Response) => {
   try {
      const user = (req as any).user as AuthUser;
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
         return res.status(400).json({ message: 'Invalid apartment ID.' });
      }
      const role = await getMemberRoleModel(user.id, id);
      if (role == null && user.global_role !== 'platform_admin') {
         return res.status(403).json({ message: 'You are not a member of this apartment.' });
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

export const getApartmentMembersController = async (req: Request, res: Response) => {
   try {
      const user = (req as any).user as AuthUser;
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
         return res.status(400).json({ message: 'Invalid apartment ID.' });
      }
      const role = await getMemberRoleModel(user.id, id);
      if (role == null && user.global_role !== 'platform_admin') {
         return res.status(403).json({ message: 'You are not a member of this apartment.' });
      }
      const members = await getApartmentMembersModel(id);
      return res.status(200).json(members);
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const removeMemberController = async (req: Request, res: Response) => {
   try {
      const user = (req as any).user as AuthUser;
      const apartmentId = Number(req.params.id);
      const targetUserId = Number(req.params.userId);
      if (
         !Number.isInteger(apartmentId) ||
         apartmentId <= 0 ||
         !Number.isInteger(targetUserId) ||
         targetUserId <= 0
      ) {
         return res.status(400).json({ message: 'Invalid apartment or user ID.' });
      }
      const adminCount = await countAdminMembersModel(apartmentId);
      if (adminCount <= 1 && targetUserId !== user.id) {
         const [rows]: any = await (
            await import('../db')
         ).default.execute(
            'SELECT role FROM apartment_members WHERE user_id = ? AND apartment_id = ?',
            [targetUserId, apartmentId],
         );
         if (rows?.[0]?.role === 'admin') {
            return res
               .status(400)
               .json({ message: 'Cannot remove the last admin. Promote another admin first.' });
         }
      }
      const result = await removeApartmentMemberModel(apartmentId, targetUserId);
      if (result.affectedRows === 0) {
         return res.status(404).json({ message: 'Member not found in this apartment.' });
      }
      return res.status(200).json({ message: 'Member removed.' });
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};
