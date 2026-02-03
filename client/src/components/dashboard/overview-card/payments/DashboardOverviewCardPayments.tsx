import { useEffect, useState } from 'react';
import MyIcon from '../../../icons/MyIcon';
import OverviewCard from '../OverviewCard';
import type { Payment } from '../../../../libs/types';
import { get } from '../../../../libs/api';
import { useAuth } from '../../../../context/AuthContext';

const DashboardOverviewCardPayments = () => {
   const { currentApartmentId } = useAuth();
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
            const paymentsRes = await get('/payments');
            if (ignore) return;
            const list = Array.isArray(paymentsRes) ? paymentsRes : [];
            setPayments(list);
         } catch (err) {
            if (ignore) return;
            console.error(err);
            setError('Failed to load payments.');
         } finally {
            if (!ignore) setLoading(false);
         }
      };

      fetchData();

      return () => {
         ignore = true;
      };
   }, [currentApartmentId]);

   const unpaidCount = payments.filter((p) => p.status === 'unpaid').length;

   if (loading) {
      return (
         <OverviewCard>
            <div className="dashboard-overview-card-top">
               <div className="dashboard-overview-card-top-left">
                  <h4>Loading...</h4>
                  <h2>...</h2>
               </div>
               <div className="dashboard-overview-card-top-right">
                  <MyIcon iconName="payments" />
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
                  <MyIcon iconName="payments" />
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
               <h4>Payments</h4>
               <h2>{payments.length}</h2>
            </div>
            <div className="dashboard-overview-card-top-right">
               <MyIcon iconName="payments" />
            </div>
         </div>
         <div className="dashboard-overview-card-bottom">
            <p>
               <MyIcon iconName="dashboardArrow" />
               <span className="green-text">{unpaidCount}</span>
               <span>unpaid</span>
            </p>
         </div>
      </OverviewCard>
   );
};

export default DashboardOverviewCardPayments;
