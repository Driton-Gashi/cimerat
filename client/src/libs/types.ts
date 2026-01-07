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

export type Complaint = {
   id: number;
   name: string;
   image_url: string;
   complaints_date: string;
   complainer_id: number;
   suspect_id: number;
   complainer_name?: string;
   suspect_name?: string;
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
   category: 'Bills' | 'Personal' | 'Product' | '';
   name: string;
   date: string;
   payer_id: number;
   amount: string;
   borrower_id?: number;
};

export type ComplaintFormData = {
   name: string;
   image_url: string;
   complaints_date: string;
   complainer_id: number;
   suspect_id: number;
};

export type Loan = {
   id: number;
   name: string;
   loan_date: string;
   loaner_id: number;
   loanee_id: number;
   amount: number;
   status: 'paid' | 'unpaid';
   loaner_name?: string;
   loanee_name?: string;
};

export type LoanFormData = {
   name: string;
   loan_date: string;
   loaner_id: number;
   loanee_id: number;
   amount: string;
};

export type paymentFilterType = {
   isFilterOn: boolean;
   isMonthFilterOn: boolean;
   date: Date | null;
   isDatePickerOpen: boolean;
   isPaymentTypeOpen: boolean;
   isPaymentStatusOpen: boolean;
   type: '' | 'Bills' | 'Personal' | 'Product';
   status: '' | 'paid' | 'unpaid';
};

export type loanFilterType = {
   isFilterOn: boolean;
   isMonthFilterOn: boolean;
   date: Date | null;
   isDatePickerOpen: boolean;
   isLoanStatusOpen: boolean;
   status: '' | 'paid' | 'unpaid';
};
