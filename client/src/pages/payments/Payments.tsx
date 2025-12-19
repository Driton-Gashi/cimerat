import { useEffect, useState } from 'react';
import './payments.css';
import { Link } from 'react-router-dom';

type Payment = {
   id: number;
   category: string;
   name: string;
   transaction_date: string;
   payer_id: number;
   amount: number;
   status: 'paid' | 'unpaid';
};

type Cimer = {
   id: number;
   name: string;
   lastname: string;
   email: string;
   password: string;
   phone: string;
};

const Payments = () => {
   const [payments, setPayments] = useState<Payment[]>([]);
   const [loading, setLoading] = useState(true);
   const [cimerat, setCimerat] = useState<Cimer[]>([]);

   const getCimerByID = (id: number): string => {
      const cimeri = cimerat.filter((cimer) => cimer.id === id);
      return cimeri[0].name;
   };

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await fetch('http://localhost:4000/api/payments/all');
            const response2 = await fetch('http://localhost:4000/api/cimerat/all');

            if (!response.ok) throw new Error('Response is not Ok');
            if (!response2.ok) throw new Error('Response is not Ok');

            const data: Payment[] = await response.json();
            const data2: Cimer[] = await response2.json();

            setPayments(data);
            setCimerat(data2);
         } catch (error) {
            console.error('Driton we got an error: ', error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
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
         <div className="filter-add-payments">
            <img src="/filter.png" width="818" alt="" />
            <Link to="/payments/create">
               <button className="create-payment-btn">+</button>
            </Link>
         </div>
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
                  {!payments.length ? (
                     <tr>
                        <th className="errorMessage" colSpan={10}>
                           Something went wrong no payments were found!
                        </th>
                     </tr>
                  ) : (
                     payments.map((payment) => (
                        <tr key={payment.id}>
                           <td>{payment.id}</td>
                           <td>{payment.category}</td>
                           <td>{payment.name}</td>
                           <td>
                              {new Date(payment.transaction_date).toLocaleDateString('en-GB', {
                                 day: '2-digit',
                                 month: 'short',
                                 year: 'numeric',
                              })}
                           </td>
                           <td>{getCimerByID(payment.payer_id)}</td>
                           <td>{payment.amount}</td>
                           <td>
                              <div className={`status ${payment.status}`}>{payment.status}</div>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default Payments;
