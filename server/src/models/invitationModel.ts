import db from '../db';
import crypto from 'crypto';

const executeQuery = async (query: string, params: any[] = []): Promise<any> => {
   try {
      const [rows] = await db.execute(query, params);
      return rows;
   } catch (error) {
      console.error('Database error:', error);
      throw error;
   }
};

function generateToken(): string {
   return crypto.randomBytes(32).toString('hex');
}

export const createInvitationModel = async (
   apartmentId: number,
   email: string,
   invitedByUserId: number,
   expiresInDays: number = 7,
) => {
   const token = generateToken();
   const expiresAt = new Date();
   expiresAt.setDate(expiresAt.getDate() + expiresInDays);
   await db.execute(
      'INSERT INTO invitations (apartment_id, email, invited_by, token, status, expires_at) VALUES (?, ?, ?, ?, ?, ?)',
      [apartmentId, email.trim().toLowerCase(), invitedByUserId, token, 'pending', expiresAt],
   );
   return { token, expiresAt };
};

export const getInvitationByTokenModel = async (token: string) => {
   const query = `
      SELECT i.id, i.apartment_id, i.email, i.invited_by, i.status, i.expires_at, i.created_at,
             a.name AS apartment_name,
             c.name AS inviter_name, c.lastname AS inviter_lastname
      FROM invitations i
      JOIN apartments a ON i.apartment_id = a.id
      JOIN cimerat c ON i.invited_by = c.id
      WHERE i.token = ?
   `;
   const rows = await executeQuery(query, [token]);
   return rows[0] || null;
};

export const setInvitationStatusModel = async (id: number, status: 'pending' | 'accepted' | 'expired') => {
   await db.execute('UPDATE invitations SET status = ? WHERE id = ?', [status, id]);
};

export const getInvitationByIdModel = async (id: number) => {
   const rows = await executeQuery('SELECT * FROM invitations WHERE id = ?', [id]);
   return (Array.isArray(rows) ? rows[0] : rows) || null;
};
