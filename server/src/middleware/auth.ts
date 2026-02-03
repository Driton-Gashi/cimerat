import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getCimerByIdModel } from '../models/cimerModel';
import { getApartmentsForUserModel } from '../models/authModel';
import { getUserPreferencesModel } from '../models/authModel';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

export type JwtPayload = { userId: number; email: string };

export type AuthUser = {
   id: number;
   email: string;
   name: string;
   lastname: string;
   global_role: string | null;
};

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
      if (!token) {
         return res.status(401).json({ message: 'Authentication required.' });
      }
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      const user = await getCimerByIdModel(decoded.userId);
      if (!user) {
         return res.status(401).json({ message: 'User not found.' });
      }
      (req as any).user = {
         id: user.id,
         email: user.email,
         name: user.name,
         lastname: user.lastname,
         global_role: user.global_role || null,
      } as AuthUser;
      next();
   } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
         return res.status(401).json({ message: 'Invalid or expired token.' });
      }
      next(err);
   }
};

export const requireApartment = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = (req as any).user as AuthUser;
      if (!user) return res.status(401).json({ message: 'Authentication required.' });
      const apartments = await getApartmentsForUserModel(user.id);
      if (!apartments || apartments.length === 0) {
         return res.status(403).json({ message: 'You must join or create an apartment first.' });
      }
      const headerId = req.headers['x-apartment-id'];
      let currentApartmentId: number | null = null;
      if (headerId) {
         const id = Number(headerId);
         if (Number.isInteger(id) && apartments.some((a: any) => a.id === id)) {
            currentApartmentId = id;
         }
      }
      if (currentApartmentId == null) {
         const prefs = await getUserPreferencesModel(user.id);
         if (prefs?.current_apartment_id != null && apartments.some((a: any) => a.id === prefs.current_apartment_id)) {
            currentApartmentId = prefs.current_apartment_id;
         } else {
            currentApartmentId = apartments[0].id;
         }
      }
      (req as any).apartments = apartments;
      (req as any).currentApartmentId = currentApartmentId;
      next();
   } catch (err) {
      next(err);
   }
};

export const requireApartmentAdmin = (paramApartmentId: 'params' | 'body', paramKey: string = 'apartment_id') => {
   return async (req: Request, res: Response, next: NextFunction) => {
      try {
         const user = (req as any).user as AuthUser;
         if (!user) return res.status(401).json({ message: 'Authentication required.' });
         const apartmentId = paramApartmentId === 'params'
            ? Number((req.params as any)[paramKey])
            : Number((req.body as any)[paramKey]);
         if (!Number.isInteger(apartmentId) || apartmentId <= 0) {
            return res.status(400).json({ message: 'Invalid apartment.' });
         }
         const db = (await import('../db')).default;
         const [rows]: any = await db.execute(
            'SELECT role FROM apartment_members WHERE user_id = ? AND apartment_id = ?',
            [user.id, apartmentId],
         );
         if (!rows?.length || rows[0].role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required for this apartment.' });
         }
         (req as any).adminApartmentId = apartmentId;
         next();
      } catch (err) {
         next(err);
      }
   };
};

export const requirePlatformAdmin = async (req: Request, res: Response, next: NextFunction) => {
   const user = (req as any).user as AuthUser;
   if (!user) return res.status(401).json({ message: 'Authentication required.' });
   if (user.global_role !== 'platform_admin') {
      return res.status(403).json({ message: 'Platform admin access required.' });
   }
   next();
};
