import db from '../db';
export type Payment = {
   id?: number;
   category?: string;
   name?: string;
   transaction_date?: Date;
   payer_id?: number;
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

export const getPaymentById = async (id: number) => {
   const query = 'SELECT * FROM payments WHERE id = ?';
   const rows = await executeQuery(query, [id]);
   return rows[0] || null;
};

export const getAllPayments = async () => {
   const query = 'SELECT * FROM payments';
   const rows = await executeQuery(query, []);
   return rows || null;
};
