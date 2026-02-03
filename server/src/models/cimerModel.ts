import db from '../db';
export type Cimeri = {
   id?: number;
   emri?: string;
   mbiemri?: string;
   email?: string;
   password?: string;
   telefoni?: string;
};

const executeQuery = async (query: string, params: any[] = []): Promise<any> => {
   try {
      const [rows] = await db.execute(query, params);
      return rows;
   } catch (error) {
      console.error('Database error:', error);
      throw error;
   }
};

export const getCimerByEmailModel = async (email: string) => {
   const query = 'SELECT * FROM cimerat WHERE email = ?';
   const rows = await executeQuery(query, [email]);
   return rows[0] || null;
};

export const getCimerByIdModel = async (id: number) => {
   const query = 'SELECT * FROM cimerat WHERE id = ?';
   const rows = await executeQuery(query, [id]);
   return rows[0] || null;
};

export const getAllCimersModel = async () => {
   const query = 'SELECT * FROM cimerat';
   const rows = await executeQuery(query, []);
   return rows || null;
};

/** For admin: list id, name, lastname, email, and their apartment id if any (one apartment per user). */
export const getAllCimersWithApartmentModel = async () => {
   const query = `
      SELECT c.id, c.name, c.lastname, c.email, c.global_role,
             (SELECT am.apartment_id FROM apartment_members am WHERE am.user_id = c.id LIMIT 1) AS apartment_id
      FROM cimerat c
      ORDER BY c.name, c.lastname
   `;
   const rows = await executeQuery(query, []);
   return rows || [];
};

/** Count how many payments, loans, complaints reference this user (block delete if any > 0). */
export const countUserReferencesModel = async (
   userId: number,
): Promise<{ payments: number; loans: number; complaints: number }> => {
   const [p]: any = await db.execute(
      'SELECT COUNT(*) AS n FROM payments WHERE payer_id = ? OR created_by = ?',
      [userId, userId],
   );
   const [l]: any = await db.execute(
      'SELECT COUNT(*) AS n FROM loans WHERE loaner_id = ? OR loanee_id = ? OR created_by = ?',
      [userId, userId, userId],
   );
   const [c]: any = await db.execute(
      'SELECT COUNT(*) AS n FROM complaints WHERE complainer_id = ? OR suspect_id = ? OR created_by = ?',
      [userId, userId, userId],
   );
   return {
      payments: p?.[0]?.n ?? 0,
      loans: l?.[0]?.n ?? 0,
      complaints: c?.[0]?.n ?? 0,
   };
};

export const deleteCimerByIdModel = async (id: number) => {
   await db.execute('DELETE FROM apartment_members WHERE user_id = ?', [id]);
   await db.execute('DELETE FROM user_preferences WHERE user_id = ?', [id]);
   await db.execute('DELETE FROM invitations WHERE invited_by = ?', [id]);
   await db.execute('DELETE FROM cimerat WHERE id = ?', [id]);
};
