import { useEffect, useMemo, useState } from 'react';
import { get } from '../../../libs/api';
import { formatCurrency, formatDate } from '../../../libs/utils';
import type { Payment } from '../../../libs/types';
import { Link, useParams } from 'react-router-dom';
import MyIcon from '../../../components/icons/MyIcon';
import './complaintsPage.css';
import OverviewCard from '../../../components/dashboard/overview-card/OverviewCard';

const ComplaintsPage = () => {
   const [payment, setPayment] = useState<Payment | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   const { id } = useParams();

   useEffect(() => {
      let cancelled = false;

      const fetchData = async () => {
         setLoading(true);
         setError(null);

         try {
            const data: Payment = await get(`/payments/${id}`);

            if (!cancelled) setPayment(data);
         } catch (err) {
            console.error(err);
            if (!cancelled) setError('Failed to load payment. Please try again.');
         } finally {
            if (!cancelled) setLoading(false);
         }
      };

      if (id) fetchData();
      else {
         setError('Missing payment id.');
         setLoading(false);
      }

      return () => {
         cancelled = true;
      };
   }, [id]);

   const paymentStatus = payment?.status === 'paid' ? 'Paid' : 'Unpaid';

   const payerDisplay = useMemo(() => {
      if (!payment) return '-';
      if (payment.payer_name) return payment.payer_name;
      return `Payer #${payment.payer_id}`;
   }, [payment]);

   if (loading)
      return (
         <div className="singlePayment">
            <div className="flex flex-space-between flex-align-center">
               <h1>Loading...</h1>
               <Link to="/payments">
                  <button className="create-payment-btn" aria-label="Back to payments">
                     <MyIcon iconName="chevronLeft" />
                  </button>
               </Link>
            </div>

            <OverviewCard>Loading payment details...</OverviewCard>
         </div>
      );

   if (error)
      return (
         <div className="singlePayment">
            <div className="flex flex-space-between flex-align-center">
               <h1>Payment</h1>
               <Link to="/payments">
                  <button className="create-payment-btn" aria-label="Back to payments">
                     <MyIcon iconName="chevronLeft" />
                  </button>
               </Link>
            </div>

            <OverviewCard>
               <div className="paymentError">
                  <p>{error}</p>
               </div>
            </OverviewCard>
         </div>
      );

   if (!payment)
      return (
         <div className="singlePayment">
            <div className="flex flex-space-between flex-align-center">
               <h1>Payment</h1>
               <Link to="/payments">
                  <button className="create-payment-btn" aria-label="Back to payments">
                     <MyIcon iconName="chevronLeft" />
                  </button>
               </Link>
            </div>

            <OverviewCard>No payment found.</OverviewCard>
         </div>
      );

   return (
      <div className="singlePayment">
         <div className="flex flex-space-between flex-align-center">
            <div className="paymentTitleWrap">
               <h1 className="paymentTitle">{payment.name}</h1>
               <div className={`paymentStatusBadge status ${paymentStatus}`}>{paymentStatus}</div>
            </div>

            <div className="paymentActions">
               <Link to="/payments">
                  <button className="create-payment-btn" aria-label="Back to payments">
                     <MyIcon iconName="chevronLeft" />
                  </button>
               </Link>
            </div>
         </div>

         <div className="paymentGrid">
            <OverviewCard>
               <div className="paymentAmountBlock">
                  <div className="paymentAmountLabel">Amount</div>
                  <div className="paymentAmountValue">{formatCurrency(payment.amount)}</div>
               </div>
            </OverviewCard>

            <OverviewCard>
               <div className="paymentDetails">
                  <div className="paymentRow">
                     <span className="paymentKey">Category</span>
                     <span className="paymentVal">{payment.category}</span>
                  </div>

                  <div className="paymentRow">
                     <span className="paymentKey">Transaction date</span>
                     <span className="paymentVal">{formatDate(payment.transaction_date)}</span>
                  </div>

                  <div className="paymentRow">
                     <span className="paymentKey">Payer</span>
                     <span className="paymentVal">{payerDisplay}</span>
                  </div>

                  <div className="paymentRow">
                     <span className="paymentKey">Status</span>
                     <span className={`paymentVal paymentStatusText ${payment.status}`}>
                        {paymentStatus}
                     </span>
                  </div>

                  <div className="paymentRow">
                     <span className="paymentKey">Payment ID</span>
                     <span className="paymentVal">#{payment.id}</span>
                  </div>
               </div>
            </OverviewCard>
         </div>
      </div>
   );
};

export default ComplaintsPage;
