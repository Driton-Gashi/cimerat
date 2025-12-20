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

export type PaymentFormData = {
   category: 'Bills' | 'Personal' | 'Product';
   name: string;
   date: string;
   payer_id: number;
   amount: string;
   borrower_id?: number;
};
export type datePickerStateType = {
   date: Date;
   isDatePickerOpen: boolean;
};
