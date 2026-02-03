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

export const createApartmentModel = async (name: string, createdByUserId: number) => {
   const [result]: any = await db.execute(
      'INSERT INTO apartments (name, created_by) VALUES (?, ?)',
      [name, createdByUserId],
   );
   const apartmentId = result.insertId;
   await db.execute(
      'INSERT INTO apartment_members (user_id, apartment_id, role) VALUES (?, ?, ?)',
      [createdByUserId, apartmentId, 'admin'],
   );
   return { insertId: apartmentId };
};

export const getApartmentByIdModel = async (id: number) => {
   const query = `
      SELECT a.id, a.name, a.created_at, a.created_by,
             c.name AS creator_name, c.lastname AS creator_lastname, c.email AS creator_email
      FROM apartments a
      LEFT JOIN cimerat c ON a.created_by = c.id
      WHERE a.id = ?
   `;
   const rows = await executeQuery(query, [id]);
   return rows[0] || null;
};

export const getApartmentMembersModel = async (apartmentId: number) => {
   const query = `
      SELECT am.user_id, am.role, am.joined_at,
             c.name, c.lastname, c.email
      FROM apartment_members am
      JOIN cimerat c ON am.user_id = c.id
      WHERE am.apartment_id = ?
      ORDER BY am.role DESC, am.joined_at ASC
   `;
   return executeQuery(query, [apartmentId]);
};

export const addApartmentMemberModel = async (
   apartmentId: number,
   userId: number,
   role: 'admin' | 'member' = 'member',
) => {
   await db.execute(
      'INSERT INTO apartment_members (user_id, apartment_id, role) VALUES (?, ?, ?)',
      [userId, apartmentId, role],
   );
};

export const removeApartmentMemberModel = async (apartmentId: number, userId: number) => {
   const [result]: any = await db.execute(
      'DELETE FROM apartment_members WHERE apartment_id = ? AND user_id = ?',
      [apartmentId, userId],
   );
   return result;
};

export const countAdminMembersModel = async (apartmentId: number): Promise<number> => {
   const [rows]: any = await db.execute(
      "SELECT COUNT(*) AS n FROM apartment_members WHERE apartment_id = ? AND role = 'admin'",
      [apartmentId],
   );
   return rows[0]?.n ?? 0;
};

export const getMemberRoleModel = async (
   userId: number,
   apartmentId: number,
): Promise<string | null> => {
   const [rows]: any = await db.execute(
      'SELECT role FROM apartment_members WHERE user_id = ? AND apartment_id = ?',
      [userId, apartmentId],
   );
   return rows[0]?.role ?? null;
};

export const isUserMemberOfApartment = async (
   userId: number,
   apartmentId: number,
): Promise<boolean> => {
   const [rows]: any = await db.execute(
      'SELECT 1 FROM apartment_members WHERE user_id = ? AND apartment_id = ?',
      [userId, apartmentId],
   );
   return rows?.length > 0;
};

export const getAllApartmentsForAdminModel = async () => {
   const query = `
      SELECT a.id, a.name, a.created_at, a.created_by,
             c.email AS creator_email, c.name AS creator_name, c.lastname AS creator_lastname,
             (SELECT COUNT(*) FROM apartment_members am WHERE am.apartment_id = a.id) AS member_count
      FROM apartments a
      LEFT JOIN cimerat c ON a.created_by = c.id
      ORDER BY a.created_at DESC
   `;
   return executeQuery(query, []);
};
