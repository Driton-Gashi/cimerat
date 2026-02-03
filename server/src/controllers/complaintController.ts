import type { Request, Response } from 'express';
import {
   createComplaintModel,
   deleteComplaintByIdModel,
   getAllComplaintsModel,
   getComplaintByIdModel,
} from '../models/complaintModel';
import type { AuthUser } from '../middleware/auth';

const serverError = (res: Response) => res.status(500).json({ message: 'Server error.' });

export const getAllComplaintsController = async (req: Request, res: Response) => {
   try {
      const currentApartmentId = (req as any).currentApartmentId as number;
      const complaints = await getAllComplaintsModel(currentApartmentId);
      return res.status(200).json(complaints);
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const getComplaintByIdController = async (req: Request, res: Response) => {
   try {
      const user = (req as any).user as AuthUser;
      const currentApartmentId = (req as any).currentApartmentId as number;
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
         return res.status(400).json({ message: 'Invalid complaint ID.' });
      }
      const complaint = await getComplaintByIdModel(id);
      if (!complaint || Array.isArray(complaint)) {
         return res.status(404).json({ message: 'Complaint not found.' });
      }
      if (complaint.apartment_id !== currentApartmentId && user.global_role !== 'platform_admin') {
         return res.status(403).json({ message: 'Access denied.' });
      }
      return res.status(200).json(complaint);
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const createNewComplaintController = async (req: Request, res: Response) => {
   try {
      const user = (req as any).user as AuthUser;
      const currentApartmentId = (req as any).currentApartmentId as number;
      const { name, image_url, complaints_date, complainer_id, suspect_id } = req.body;
      if (!name || !image_url || !complaints_date || complainer_id == null || suspect_id == null) {
         return res.status(400).json({ message: 'Missing required fields.' });
      }
      const complainerIdNum = Number(complainer_id);
      const suspectIdNum = Number(suspect_id);
      const dateObj = new Date(complaints_date);
      if (!Number.isInteger(complainerIdNum) || complainerIdNum <= 0) {
         return res.status(400).json({ message: 'Invalid complainer_id.' });
      }
      if (!Number.isInteger(suspectIdNum) || suspectIdNum <= 0) {
         return res.status(400).json({ message: 'Invalid suspect_id.' });
      }
      if (Number.isNaN(dateObj.getTime())) {
         return res.status(400).json({ message: 'Invalid complaints_date.' });
      }
      const result = await createComplaintModel(
         name,
         image_url,
         dateObj,
         complainerIdNum,
         suspectIdNum,
         currentApartmentId,
         user.id,
      );
      const createdComplaint = await getComplaintByIdModel(Number(result.insertId));
      return res.status(201).json({
         message: `${name} complaint was added successfully`,
         createdComplaint: Array.isArray(createdComplaint) ? null : createdComplaint,
      });
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};

export const deleteComplaintByIdController = async (req: Request, res: Response) => {
   try {
      const user = (req as any).user as AuthUser;
      const currentApartmentId = (req as any).currentApartmentId as number;
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
         return res.status(400).json({ message: 'Invalid complaint ID.' });
      }
      const complaint = await getComplaintByIdModel(id);
      if (!complaint || Array.isArray(complaint)) {
         return res.status(404).json({ message: 'Complaint not found.' });
      }
      if (complaint.apartment_id !== currentApartmentId && user.global_role !== 'platform_admin') {
         return res.status(403).json({ message: 'Access denied.' });
      }
      const result: any = await deleteComplaintByIdModel(id);
      if (!result || result.affectedRows === 0) {
         return res.status(404).json({ message: 'Complaint not found.' });
      }
      return res.status(200).json({ message: 'Complaint deleted successfully.' });
   } catch (error) {
      console.error(error);
      return serverError(res);
   }
};
