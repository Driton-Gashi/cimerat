import { useEffect, useState } from 'react';
import MyIcon from '../../../icons/MyIcon';
import OverviewCard from '../OverviewCard';
import type { Payment } from '../../../../libs/types';
import { get } from '../../../../libs/api';
import { useAuth } from '../../../../context/AuthContext';
import { isInThisWeekMondayStart } from '../../../../libs/utils';

const DashboardOverviewCardCimerat = () => {
   const { currentApartmentId } = useAuth();
   const [memberCount, setMemberCount] = useState(0);
   const [payments, setPayments] = useState<Payment[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      if (!currentApartmentId) return;
      let ignore = false;

      const fetchData = async () => {
         setLoading(true);
         setError(null);

         try {
            const [membersRes, paymentsRes] = await Promise.all([
               get(`/apartments/${currentApartmentId}/members`),
               get('/payments'),
            ]);

            if (ignore) return;
            const paymentsThisWeek = (Array.isArray(paymentsRes) ? paymentsRes : []).filter((payment: Payment) =>
               isInThisWeekMondayStart(payment.transaction_date),
            );

            setMemberCount(Array.isArray(membersRes) ? membersRes.length : 0);
            setPayments(paymentsThisWeek);
         } catch (err) {
            if (ignore) return;
            console.error(err);
            setError('Failed to load dashboard data.');
         } finally {
            if (!ignore) setLoading(false);
         }
      };

      fetchData();

      return () => {
         ignore = true;
      };
   }, [currentApartmentId]);

   if (loading) {
      return (
         <OverviewCard>
            <div className="dashboard-overview-card-top">
               <div className="dashboard-overview-card-top-left">
                  <h4>Loading...</h4>
                  <h2>...</h2>
               </div>
               <div className="dashboard-overview-card-top-right">
                  <img src="/users.png" alt="Users" />
               </div>
            </div>
            <div className="dashboard-overview-card-bottom">
               <p>
                  <span>...</span>
               </p>
            </div>
         </OverviewCard>
      );
   }

   if (error) {
      return (
         <OverviewCard>
            <div className="dashboard-overview-card-top">
               <div className="dashboard-overview-card-top-left">
                  <h4>Error</h4>
                  <h2>-</h2>
               </div>
               <div className="dashboard-overview-card-top-right">
                  <img src="/users.png" alt="Users" />
               </div>
            </div>
            <div className="dashboard-overview-card-bottom">
               <p>{error}</p>
            </div>
         </OverviewCard>
      );
   }

   return (
      <OverviewCard>
         <div className="dashboard-overview-card-top">
            <div className="dashboard-overview-card-top-left">
               <h4>Total Cimerat</h4>
               <h2>{memberCount}</h2>
            </div>
            <div className="dashboard-overview-card-top-right">
               <img src="/users.png" alt="Users" />
            </div>
         </div>
         <div className="dashboard-overview-card-bottom">
            <p>
               <MyIcon iconName="dashboardArrow" />
               <span className="green-text">{payments.length}</span>
               <span>Payments this week</span>
            </p>
         </div>
      </OverviewCard>
   );
};

export default DashboardOverviewCardCimerat;
