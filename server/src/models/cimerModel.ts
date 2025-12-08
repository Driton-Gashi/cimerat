import db from '../db';
export type Cimeri = {
   id?: number;
   name?: string;
   lastname?: string;
   email?: string;
   password?: string;
   phone?: string;
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

export const findUserByEmail = async (email: string): Promise<Cimeri | null> => {
   const query = 'SELECT * FROM users WHERE email = ?';
   const rows = await executeQuery(query, [email]);
   return rows[0] || null;
};
