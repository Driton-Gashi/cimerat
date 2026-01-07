import db from '../db';

export type Loan = {
   id: number;
   name: string;
   loan_date: Date;
   loaner_id: number;
   loanee_id: number;
   amount: number;
   status: 'paid' | 'unpaid';
   loaner_name?: string;
   loanee_name?: string;
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

export const getLoanByIdModel = async (id: number): Promise<Loan> => {
   const query = `
      SELECT l.id,
             l.name,
             l.loan_date,
             l.amount,
             l.status,
             loaner.id   AS loaner_id,
             loaner.name AS loaner_name,
             loanee.id   AS loanee_id,
             loanee.name AS loanee_name
      FROM loans l
      JOIN cimerat loaner
         ON l.loaner_id = loaner.id
      JOIN cimerat loanee
         ON l.loanee_id = loanee.id
      WHERE l.id = ?
   `;

   const rows = await executeQuery(query, [id]);

   return rows[0];
};

export const getAllLoansModel = async (): Promise<Loan[]> => {
   const query = `
      SELECT l.id,
             l.name,
             l.loan_date,
             l.amount,
             l.status,
             loaner.id   AS loaner_id,
             loaner.name AS loaner_name,
             loanee.id   AS loanee_id,
             loanee.name AS loanee_name
      FROM loans l
      JOIN cimerat loaner
         ON l.loaner_id = loaner.id
      JOIN cimerat loanee
         ON l.loanee_id = loanee.id
   `;
   const rows = await executeQuery<Loan>(query);
   return rows;
};

export const createLoanModel = async (
   name: string,
   loan_date: Date,
   loaner_id: number,
   loanee_id: number,
   amount: number,
) => {
   const query = `
    INSERT INTO loans (name, loan_date, loaner_id, loanee_id, amount)
    VALUES (?, ?, ?, ?, ?)
  `;
   const result: any = await executeQuery(query, [name, loan_date, loaner_id, loanee_id, amount]);
   return result;
};
