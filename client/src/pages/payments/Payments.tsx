import { useEffect, useState } from 'react';
import './payments.css';

type Payment = {
   id: number;
   category: string;
   name: string;
   transaction_date: string;
   payer_id: number;
   amount: number;
   status: 'paid' | 'unpaid';
};

const Payments = () => {
   const [payments, setPayments] = useState<Payment[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchPayments = async () => {
         try {
            const response = await fetch('http://localhost:4000/api/payments/all');
            if (!response.ok) throw new Error('Response is not Ok');
            const data: Payment[] = await response.json();
            setPayments(data);
            console.log(data);
         } catch (error) {
            console.error('Driton we got an error: ', error);
         } finally {
            setLoading(false);
         }
      };
      fetchPayments();
   }, []);

   if (loading)
      return (
         <div className="payments">
            <p>Loading Payments</p>
         </div>
      );

   return (
      <div className="payments">
         <h1>Payments</h1>
         <img src="/filter.png" width="818" alt="" />
         <div className="tableWrapper">
            <table border={0}>
               <thead>
                  <tr className="firstRow">
                     <th>ID</th>
                     <th>Category</th>
                     <th>Payment Name</th>
                     <th>Date</th>
                     <th>Payer</th>
                     <th>Amount</th>
                     <th>Status</th>
                  </tr>
               </thead>

               <tbody>
                  {payments.map((payment) => (
                     <tr key={payment.id}>
                        <td>{payment.name}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default Payments;
