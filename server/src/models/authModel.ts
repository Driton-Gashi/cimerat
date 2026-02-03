import db from '../db';

const executeQuery = async (query: string, params: any[] = []): Promise<any> => {
   try {
      const [rows] = await db.execute(query, params);
      return rows;
   } catch (error) {
      console.error('Database error:', error);
      throw error;
   }
};

export const createUserModel = async (
   name: string,
   lastname: string,
   email: string,
   hashedPassword: string,
   phone: string,
) => {
   const query = `
      INSERT INTO cimerat (name, lastname, email, password, phone)
      VALUES (?, ?, ?, ?, ?)
   `;
   const result: any = await db.execute(query, [name, lastname, email, hashedPassword, phone]);
   return result[0];
};

export const getApartmentsForUserModel = async (userId: number) => {
   const query = `
      SELECT a.id, a.name, a.created_at, am.role, am.joined_at
      FROM apartment_members am
      JOIN apartments a ON am.apartment_id = a.id
      WHERE am.user_id = ?
      ORDER BY am.joined_at ASC
   `;
   const rows = await executeQuery(query, [userId]);
   return rows;
};

export const getUserPreferencesModel = async (userId: number) => {
   const query = 'SELECT current_apartment_id FROM user_preferences WHERE user_id = ?';
   const rows = await executeQuery(query, [userId]);
   return rows[0] || null;
};

export const setCurrentApartmentModel = async (userId: number, apartmentId: number | null) => {
   const existing = await getUserPreferencesModel(userId);
   if (existing) {
      await db.execute('UPDATE user_preferences SET current_apartment_id = ? WHERE user_id = ?', [
         apartmentId,
         userId,
      ]);
   } else {
      await db.execute('INSERT INTO user_preferences (user_id, current_apartment_id) VALUES (?, ?)', [
         userId,
         apartmentId,
      ]);
   }
};
