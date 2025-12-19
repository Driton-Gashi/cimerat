export type Payment = {
   id: number;
   category: string;
   name: string;
   transaction_date: string;
   payer_id: number;
   amount: number;
   status: 'paid' | 'unpaid';
   payer_name?: string;
};

export type Cimer = {
   id: number;
   name: string;
   lastname: string;
   email: string;
   password: string;
   phone: string;
};
