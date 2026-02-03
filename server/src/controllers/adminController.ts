import type { Request, Response } from 'express';
import { getAllApartmentsForAdminModel } from '../models/apartmentModel';
import { getApartmentByIdModel, getApartmentMembersModel } from '../models/apartmentModel';

const serverError = (res: Response) => res.status(500).json({ message: 'Server error.' });

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
