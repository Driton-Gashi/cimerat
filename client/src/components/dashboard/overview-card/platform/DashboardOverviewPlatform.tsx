import { useEffect, useState } from 'react';
import MyIcon from '../../../icons/MyIcon';
import OverviewCard from '../OverviewCard';
import { get } from '../../../../libs/api';

type DashboardStats = {
   totalMembers: number;
   totalPayments: number;
   unpaidPayments: number;
   paymentsThisWeek: number;
   totalLoans: number;
   unpaidLoans: number;
   totalComplaints: number;
};

const DashboardOverviewPlatform = () => {
   const [stats, setStats] = useState<DashboardStats | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      let ignore = false;
      const fetchData = async () => {
         setLoading(true);
         setError(null);
         try {
            const data = await get('/admin/dashboard-stats');
            if (ignore) return;
            setStats(data as DashboardStats);
         } catch (err) {
            if (!ignore) {
               console.error(err);
               setError('Failed to load platform stats.');
            }
         } finally {
            if (!ignore) setLoading(false);
         }
      };
      fetchData();
      return () => {
         ignore = true;
      };
   }, []);

   if (loading) {
      return (
         <div className="dashboard-overview" style={{ display: 'flex', gap: '2rem' }}>
            {[1, 2, 3, 4].map((i) => (
               <OverviewCard key={i}>
                  <div className="dashboard-overview-card-top">
                     <div className="dashboard-overview-card-top-left">
                        <h4>Loading...</h4>
                        <h2>...</h2>
                     </div>
                  </div>
                  <div className="dashboard-overview-card-bottom">
                     <p>
                        <span>...</span>
                     </p>
                  </div>
               </OverviewCard>
            ))}
         </div>
      );
   }

   if (error || !stats) {
      return (
         <div className="dashboard-overview">
            <OverviewCard>
               <p style={{ color: 'var(--error, #c00)' }}>{error || 'No data'}</p>
            </OverviewCard>
         </div>
      );
   }

   return (
      <div className="dashboard-overview">
         <OverviewCard>
            <div className="dashboard-overview-card-top">
               <div className="dashboard-overview-card-top-left">
                  <h4>Total Cimerat</h4>
                  <h2>{stats.totalMembers}</h2>
               </div>
               <div className="dashboard-overview-card-top-right">
                  <img src="/users.png" alt="Users" />
               </div>
            </div>
            <div className="dashboard-overview-card-bottom">
               <p>
                  <MyIcon iconName="dashboardArrow" />
                  <span className="green-text">{stats.paymentsThisWeek}</span>
                  <span>Payments this week</span>
               </p>
            </div>
         </OverviewCard>

         <OverviewCard>
            <div className="dashboard-overview-card-top">
               <div className="dashboard-overview-card-top-left">
                  <h4>Payments</h4>
                  <h2>{stats.totalPayments}</h2>
               </div>
               <div className="dashboard-overview-card-top-right">
                  <MyIcon iconName="payments" />
               </div>
            </div>
            <div className="dashboard-overview-card-bottom">
               <p>
                  <MyIcon iconName="dashboardArrow" />
                  <span className="green-text">{stats.unpaidPayments}</span>
                  <span>unpaid</span>
               </p>
            </div>
         </OverviewCard>

         <OverviewCard>
            <div className="dashboard-overview-card-top">
               <div className="dashboard-overview-card-top-left">
                  <h4>Loans</h4>
                  <h2>{stats.totalLoans}</h2>
               </div>
               <div className="dashboard-overview-card-top-right dashboard-overview-card-icon">
                  <MyIcon iconName="loans" />
               </div>
            </div>
            <div className="dashboard-overview-card-bottom">
               <p>
                  <MyIcon iconName="dashboardArrow" />
                  <span className="green-text">{stats.unpaidLoans}</span>
                  <span>unpaid</span>
               </p>
            </div>
         </OverviewCard>

         <OverviewCard>
            <div className="dashboard-overview-card-top">
               <div className="dashboard-overview-card-top-left">
                  <h4>Complaints</h4>
                  <h2>{stats.totalComplaints}</h2>
               </div>
               <div className="dashboard-overview-card-top-right dashboard-overview-card-icon">
                  <MyIcon iconName="complaints" />
               </div>
            </div>
            <div className="dashboard-overview-card-bottom">
               <p>
                  <span>Total complaints</span>
               </p>
            </div>
         </OverviewCard>
      </div>
   );
};

export default DashboardOverviewPlatform;
