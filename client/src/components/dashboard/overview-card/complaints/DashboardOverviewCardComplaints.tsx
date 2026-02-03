import { useEffect, useState } from 'react';
import OverviewCard from '../OverviewCard';
import type { Complaint } from '../../../../libs/types';
import { get } from '../../../../libs/api';
import { useAuth } from '../../../../context/AuthContext';
import MyIcon from '../../../icons/MyIcon';

const DashboardOverviewCardComplaints = () => {
   const { currentApartmentId } = useAuth();
   const [complaints, setComplaints] = useState<Complaint[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      if (!currentApartmentId) return;
      let ignore = false;

      const fetchData = async () => {
         setLoading(true);
         setError(null);

         try {
            const complaintsRes = await get('/complaints');
            if (ignore) return;
            const list = Array.isArray(complaintsRes) ? complaintsRes : [];
            setComplaints(list);
         } catch (err) {
            if (ignore) return;
            console.error(err);
            setError('Failed to load complaints.');
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
               <div className="dashboard-overview-card-top-right dashboard-overview-card-icon">
                  <MyIcon iconName="complaints" />
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
                  <MyIcon iconName="complaints" />
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
               <h4>Complaints</h4>
               <h2>{complaints.length}</h2>
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
   );
};

export default DashboardOverviewCardComplaints;
