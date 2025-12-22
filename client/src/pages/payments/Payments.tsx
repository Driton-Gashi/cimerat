import { useEffect, useState } from 'react';
import MyIcon from '../../components/icons/MyIcon';
import { get } from '../../libs/api';
import type { Payment } from '../../libs/types';

import './payments.css';
import FilterControls from '../../components/payments/filter/FilterControls';
import PaymentsDataTable from '../../components/payments/filter/PaymentsDataTable';

const Payments = () => {
   const cachedPayments: Payment[] = JSON.parse(localStorage.getItem('payments') ?? '[]');

   const [payments, setPayments] = useState(cachedPayments);

   const [loading, setLoading] = useState(cachedPayments.length == 0);

   useEffect(() => {
      if (payments.length != 0) return;

      const fetchData = async () => {
         try {
            const payments: Payment[] = await get('/payments');
            setPayments(payments);
            localStorage.setItem('payments', JSON.stringify(payments));
         } catch (error) {
            console.error('Driton we got an error: ', error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, [payments.length]);

   if (loading) return <PaymentLoadingScreen />;

   return (
      <div className="payments">
         <h1>Payments</h1>
         <FilterControls />
         <PaymentsDataTable payments={payments} />
      </div>
   );
};

export default Payments;

const PaymentLoadingScreen = () => {
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
};
