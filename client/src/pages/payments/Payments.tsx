import { useEffect, useState } from 'react';
import MyIcon from '../../components/icons/MyIcon';
import { get } from '../../libs/api';
import type { Payment } from '../../libs/types';

import './payments.css';
import FilterControls from '../../components/dashboard/filter/FilterControls';

const Payments = () => {
   const [payments, setPayments] = useState<Payment[]>([]);
   const [loading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const payments: Payment[] = await get('/payments');

            setPayments(payments);
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
         <FilterControls />
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
                           <td>{payment.payer_name}</td>
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
