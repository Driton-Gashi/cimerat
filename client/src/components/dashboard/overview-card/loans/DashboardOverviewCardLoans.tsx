import { useEffect, useState } from 'react';
import MyIcon from '../../../icons/MyIcon';
import OverviewCard from '../OverviewCard';
import type { Loan } from '../../../../libs/types';
import { get } from '../../../../libs/api';
import { useAuth } from '../../../../context/AuthContext';

const DashboardOverviewCardLoans = () => {
   const { currentApartmentId } = useAuth();
   const [loans, setLoans] = useState<Loan[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      if (!currentApartmentId) return;
      let ignore = false;

      const fetchData = async () => {
         setLoading(true);
         setError(null);

         try {
            const loansRes = await get('/loans');
            if (ignore) return;
            const list = Array.isArray(loansRes) ? loansRes : [];
            setLoans(list);
         } catch (err) {
            if (ignore) return;
            console.error(err);
            setError('Failed to load loans.');
         } finally {
            if (!ignore) setLoading(false);
         }
      };

      fetchData();

      return () => {
         ignore = true;
      };
   }, [currentApartmentId]);

   const unpaidCount = loans.filter((l) => l.status === 'unpaid').length;

   if (loading) {
      return (
         <OverviewCard>
            <div className="dashboard-overview-card-top">
               <div className="dashboard-overview-card-top-left">
                  <h4>Loading...</h4>
                  <h2>...</h2>
               </div>
               <div className="dashboard-overview-card-top-right dashboard-overview-card-icon">
                  <MyIcon iconName="loans" />
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
               <div className="dashboard-overview-card-top-right dashboard-overview-card-icon">
                  <MyIcon iconName="loans" />
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
               <h4>Loans</h4>
               <h2>{loans.length}</h2>
            </div>
            <div className="dashboard-overview-card-top-right dashboard-overview-card-icon">
               <MyIcon iconName="loans" />
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

export default DashboardOverviewCardLoans;
