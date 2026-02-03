import db from '../db';

export type Complaint = {
   id: number;
   name: string;
   image_url: string;
   complaints_date: Date;
   complainer_id: number;
   suspect_id: number;
   complainer_name?: string;
   suspect_name?: string;
};

const executeQuery = async <T = any>(query: string, params: any[] = []): Promise<T[]> => {
   try {
      const [rows] = await db.execute(query, params);
      return rows as T[];
   } catch (error) {
      console.error('Database error:', error);
      throw error;
   }
};

export const getComplaintByIdModel = async (id: number): Promise<(Complaint & { apartment_id?: number }) | []> => {
   const query = `
      SELECT c.id,
             c.name,
             c.image_url,
             c.complaints_date,
             c.complainer_id,
             complainer.name AS complainer_name,
             c.suspect_id,
             suspect.name   AS suspect_name,
             c.apartment_id
      FROM complaints c
      JOIN cimerat complainer ON c.complainer_id = complainer.id
      JOIN cimerat suspect ON c.suspect_id = suspect.id
      WHERE c.id = ?
   `;
   const rows = await executeQuery<Complaint>(query, [id]);
   return rows[0] ? rows[0] : [];
};

export const getAllComplaintsModel = async (apartmentId: number): Promise<Complaint[]> => {
   const query = `
      SELECT c.id,
             c.name,
             c.image_url,
             c.complaints_date,
             c.complainer_id,
             complainer.name AS complainer_name,
             c.suspect_id,
             suspect.name   AS suspect_name
      FROM complaints c
      JOIN cimerat complainer ON c.complainer_id = complainer.id
      JOIN cimerat suspect ON c.suspect_id = suspect.id
      WHERE c.apartment_id = ?
   `;
   const rows = await executeQuery<Complaint>(query, [apartmentId]);
   return rows;
};

export const createComplaintModel = async (
   name: string,
   image_url: string,
   complaints_date: Date,
   complainer_id: number,
   suspect_id: number,
   apartment_id: number,
   created_by: number,
) => {
   const query = `
      INSERT INTO complaints (name, image_url, complaints_date, complainer_id, suspect_id, apartment_id, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
   `;
   const [result]: any = await db.execute(query, [
      name,
      image_url,
      complaints_date,
      complainer_id,
      suspect_id,
      apartment_id,
      created_by,
   ]);
   return result;
};

export const deleteComplaintByIdModel = async (id: number) => {
   const query = 'DELETE FROM complaints WHERE id = ?';
   const result: any = await executeQuery(query, [id]);
   return result;
};
