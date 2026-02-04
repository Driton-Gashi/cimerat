import OverviewCard from '../../components/dashboard/overview-card/OverviewCard';
import ApexChart from '../../components/dashboard/chart/ApexChart';
import { useAuth } from '../../context/AuthContext';
import './home.css';
import DashboardOverviewCardCimerat from '../../components/dashboard/overview-card/cimerat/DashboardOverviewCardCimerat';
import DashboardOverviewCardPayments from '../../components/dashboard/overview-card/payments/DashboardOverviewCardPayments';
import DashboardOverviewCardLoans from '../../components/dashboard/overview-card/loans/DashboardOverviewCardLoans';
import DashboardOverviewCardComplaints from '../../components/dashboard/overview-card/complaints/DashboardOverviewCardComplaints';
import DashboardOverviewPlatform from '../../components/dashboard/overview-card/platform/DashboardOverviewPlatform';

const Home = () => {
   const { user } = useAuth();
   const isPlatformAdmin = user?.global_role === 'platform_admin';

   return (
      <div className="home">
         <h1>Dashboard</h1>

         {isPlatformAdmin ? (
            <DashboardOverviewPlatform />
         ) : (
            <>
               <div className="dashboard-overview">
                  <DashboardOverviewCardCimerat />
                  <DashboardOverviewCardPayments />
                  <DashboardOverviewCardLoans />
                  <DashboardOverviewCardComplaints />
               </div>
               <div>
                  <OverviewCard>
                     <h2>Spending details</h2>
                     <ApexChart />
                  </OverviewCard>
               </div>
            </>
         )}
      </div>
   );
};

export default Home;
