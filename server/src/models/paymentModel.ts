import db from '../db';

export type Payment = {
   id: number;
   category: string;
   name: string;
   transaction_date: Date;
   payer_id: number;
   payer_name?: string;
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
   const query = `
            SELECT p.id,
                  p.category,
                  p.name,
                  p.transaction_date,
                  p.amount,
                  p.status,
                  c.id                            AS payer_id,
                  c.name                          AS payer_name
            FROM   payments p
                  JOIN cimerat c
                     ON p.payer_id = c.id 
`;
   const rows = await executeQuery<Payment>(query);
   return rows;
};

export const createPaymentModel = async (
   category: string,
   name: string,
   date: Date,
   payer_id: number,
   amount: number,
) => {
   const query = `
    INSERT INTO payments ( category, name, transaction_date, payer_id, amount)
    VALUES ( ?, ?, ?, ?, ?)
  `;
   await executeQuery(query, [category, name, date, payer_id, amount]);
};
