import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MyIcon from '../../components/icons/MyIcon';
import { get } from '../../libs/api';

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
            const payments: Payment[] = await get('/payments');
            const cimers: Cimer[] = await get('/cimers');

            setPayments(payments);
            setCimerat(cimers);
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
            <h1>Payments</h1>
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
                     <tr>
                        <th colSpan={10}>
                           <div className="loadingPaymentsMessage">
                              Payments are loading <MyIcon iconName="loadingSvg" />
                           </div>
                        </th>
                     </tr>
                  </tbody>
               </table>
            </div>
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
