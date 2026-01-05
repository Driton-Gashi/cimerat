import { useEffect, useState } from 'react';
import MyIcon from '../../components/icons/MyIcon';
import { get } from '../../libs/api';
import type { Payment, paymentFilterType } from '../../libs/types';

import './complaints.css';

const Complaints = () => {
   const [paymentFilter, setPaymentFilter] = useState<paymentFilterType>({
      isFilterOn: false,
      isMonthFilterOn: false,
      date: null,
      isDatePickerOpen: false,
      isPaymentTypeOpen: false,
      isPaymentStatusOpen: false,
      type: '',
      status: '',
   });

   const [allPayments, setAllPayments] = useState<Payment[]>(() => {
      try {
         return JSON.parse(localStorage.getItem('payments') ?? '[]');
      } catch {
         return [];
      }
   });

   const [loading, setLoading] = useState(allPayments.length === 0);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const payments: Payment[] = await get('/payments');
            setAllPayments(payments);
            localStorage.setItem('payments', JSON.stringify(payments));
         } catch (error) {
            console.error('Driton we got an error: ', error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   const payments = !paymentFilter.isFilterOn
      ? allPayments
      : allPayments.filter((payment) => {
           if (paymentFilter.status === 'paid' || paymentFilter.status === 'unpaid') {
              if (payment.status !== paymentFilter.status) return false;
           }

           if (paymentFilter.type) {
              if (payment.category !== paymentFilter.type) return false;
           }

           if (paymentFilter.isMonthFilterOn) {
              const selectedYear = paymentFilter?.date?.getFullYear();
              const selectedMonth = paymentFilter?.date?.getMonth();

              const d = new Date(payment.transaction_date);
              if (Number.isNaN(d.getTime())) return false;

              if (d.getFullYear() !== selectedYear) return false;
              if (d.getMonth() !== selectedMonth) return false;
           }

           return true;
        });

   if (loading) return <PaymentLoadingScreen />;

   return (
      <div className="payments">
         <h1>Complaints</h1>
      </div>
   );
};

export default Complaints;

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
