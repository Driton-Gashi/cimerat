import db from '../db';

export type Payment = {
   id: number;
   category: string;
   name: string;
   transaction_date: Date;
   payer_id: number;
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

export const getPaymentByIdModel = async (id: number): Promise<Payment[]> => {
   const query = 'SELECT * FROM payments WHERE id = ?';
   const rows = await executeQuery<Payment>(query, [id]);
   return rows;
};

export const getAllPaymentsModel = async (): Promise<Payment[]> => {
   const query = 'SELECT * FROM payments';
   return executeQuery<Payment>(query);
};
