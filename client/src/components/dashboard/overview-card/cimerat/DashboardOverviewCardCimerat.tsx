import { useEffect, useState } from 'react';
import MyIcon from '../../../icons/MyIcon';
import OverviewCard from '../OverviewCard';
import type { Cimer, Payment } from '../../../../libs/types';
import { get } from '../../../../libs/api';

const DashboardOverviewCardCimerat = () => {
   const [cimerat, setCimerat] = useState<Cimer[]>([]);
   const [payments, setPayments] = useState<Payment[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      try {
         const fetchData = async () => {
            const cimerat = await get('/cimerat');
            const payments = await get('/payments');
            setCimerat(cimerat);
            setPayments(payments);
         };
         fetchData();
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
      }
   }, []);
   if (loading) {
      return (
         <OverviewCard>
            <div className="dashboard-overview-card-top">
               <div className="dashboard-overview-card-top-left">
                  <h4>Loading...</h4>
                  <h2></h2>
               </div>
               <div className="dashboard-overview-card-top-right">
                  <img src="/users.png" />
               </div>
            </div>
            <div className="dashboard-overview-card-bottom">
               <p>
                  <MyIcon iconName="dashboardArrow" /> <span className="green-text"></span>
                  <span></span>
               </p>
            </div>
         </OverviewCard>
      );
   }
   return (
      <OverviewCard>
         <div className="dashboard-overview-card-top">
            <div className="dashboard-overview-card-top-left">
               <h4>Total Cimerat</h4>
               <h2>{cimerat.length}</h2>
            </div>
            <div className="dashboard-overview-card-top-right">
               <img src="/users.png" />
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
