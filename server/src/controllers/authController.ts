import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getCimerByEmailModel } from '../models/cimerModel';
import {
   createUserModel,
   getApartmentsForUserModel,
   getUserPreferencesModel,
   setCurrentApartmentModel,
} from '../models/authModel';
import { getMemberRoleModel, getAllApartmentsForDashboardModel, getApartmentByIdModel } from '../models/apartmentModel';
import type { AuthUser } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 10;

const serverError = (res: Response) => res.status(500).json({ message: 'Server error.' });

function signToken(userId: number, email: string): string {
   const expiresIn = JWT_EXPIRES_IN === '7d' ? 7 * 24 * 60 * 60 : Number(JWT_EXPIRES_IN) || 7 * 24 * 60 * 60;
   return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn });
}

function toSafeUser(row: any): AuthUser {
   return {
      id: row.id,
      email: row.email,
      name: row.name,
      lastname: row.lastname,
      global_role: row.global_role || null,
   };
}

export const signupController = async (req: Request, res: Response) => {
   try {
      const { email, password, name, lastname, phone } = req.body;
      if (!email || !password || !name || !lastname || phone == null) {
         return res.status(400).json({ message: 'Missing required fields: email, password, name, lastname, phone.' });
      }
      const existing = await getCimerByEmailModel(email.trim());
      if (existing) {
         return res.status(409).json({ message: 'An account with this email already exists.' });
      }
      const hashedPassword = await bcrypt.hash(String(password), SALT_ROUNDS);
      const result = await createUserModel(
         String(name).trim(),
         String(lastname).trim(),
         String(email).trim().toLowerCase(),
         hashedPassword,
         String(phone),
      );
      const userId = result.insertId;
      const user = await getCimerByEmailModel(String(email).trim().toLowerCase());
      const token = signToken(userId, user.email);
      const apartments = await getApartmentsForUserModel(userId);
      const prefs = await getUserPreferencesModel(userId);
      const currentApartmentId = prefs?.current_apartment_id ?? null;
      return res.status(201).json({
         token,
         user: toSafeUser(user),
         apartments: apartments || [],
         currentApartmentId,
      });
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const loginController = async (req: Request, res: Response) => {
   try {
      const { email, password } = req.body;
      if (!email || !password) {
         return res.status(400).json({ message: 'Email and password are required.' });
      }
      const user = await getCimerByEmailModel(String(email).trim().toLowerCase());
      if (!user) {
         return res.status(401).json({ message: 'Invalid email or password.' });
      }
      const match = await bcrypt.compare(String(password), user.password);
      if (!match) {
         return res.status(401).json({ message: 'Invalid email or password.' });
      }
      const token = signToken(user.id, user.email);
      const isPlatformAdmin = user.global_role === 'platform_admin';
      const apartments = isPlatformAdmin
         ? await getAllApartmentsForDashboardModel()
         : await getApartmentsForUserModel(user.id);
      const prefs = await getUserPreferencesModel(user.id);
      let currentApartmentId = prefs?.current_apartment_id ?? null;
      const apartmentList = apartments || [];
      if (currentApartmentId == null && apartmentList.length > 0) {
         currentApartmentId = apartmentList[0].id;
      }
      return res.status(200).json({
         token,
         user: toSafeUser(user),
         apartments: apartmentList,
         currentApartmentId,
      });
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const getMeController = async (req: Request, res: Response) => {
   try {
      const user = (req as any).user as AuthUser;
      const isPlatformAdmin = user.global_role === 'platform_admin';
      const apartments = isPlatformAdmin
         ? await getAllApartmentsForDashboardModel()
         : await getApartmentsForUserModel(user.id);
      const prefs = await getUserPreferencesModel(user.id);
      let currentApartmentId = prefs?.current_apartment_id ?? null;
      const apartmentList = apartments || [];
      if (currentApartmentId == null && apartmentList.length > 0) {
         currentApartmentId = apartmentList[0].id;
      }
      if (currentApartmentId != null && isPlatformAdmin) {
         const exists = await getApartmentByIdModel(currentApartmentId);
         if (!exists) currentApartmentId = apartmentList[0]?.id ?? null;
      }
      return res.status(200).json({
         user,
         apartments: apartmentList,
         currentApartmentId,
      });
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const patchCurrentApartmentController = async (req: Request, res: Response) => {
   try {
      const user = (req as any).user as AuthUser;
      const apartmentId = req.body.apartment_id != null ? Number(req.body.apartment_id) : null;
      if (apartmentId !== null && (!Number.isInteger(apartmentId) || apartmentId <= 0)) {
         return res.status(400).json({ message: 'Invalid apartment_id.' });
      }
      const isPlatformAdmin = user.global_role === 'platform_admin';
      if (apartmentId !== null && !isPlatformAdmin) {
         const role = await getMemberRoleModel(user.id, apartmentId);
         if (role == null) {
            return res.status(403).json({ message: 'You are not a member of this apartment.' });
         }
      }
      if (apartmentId !== null && isPlatformAdmin) {
         const exists = await getApartmentByIdModel(apartmentId);
         if (!exists) {
            return res.status(404).json({ message: 'Apartment not found.' });
         }
      }
      await setCurrentApartmentModel(user.id, apartmentId);
      const apartments = isPlatformAdmin
         ? await getAllApartmentsForDashboardModel()
         : await getApartmentsForUserModel(user.id);
      const prefs = await getUserPreferencesModel(user.id);
      return res.status(200).json({
         currentApartmentId: prefs?.current_apartment_id ?? apartmentId,
         apartments: apartments || [],
      });
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};
