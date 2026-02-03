import OverviewCard from '../../components/dashboard/overview-card/OverviewCard';
import ApexChart from '../../components/dashboard/chart/ApexChart';
import { useAuth } from '../../context/AuthContext';
import './home.css';
import DashboardOverviewCardCimerat from '../../components/dashboard/overview-card/cimerat/DashboardOverviewCardCimerat';
import DashboardOverviewCardPayments from '../../components/dashboard/overview-card/payments/DashboardOverviewCardPayments';
import DashboardOverviewCardLoans from '../../components/dashboard/overview-card/loans/DashboardOverviewCardLoans';
import DashboardOverviewCardComplaints from '../../components/dashboard/overview-card/complaints/DashboardOverviewCardComplaints';

const Home = () => {
   const { apartments, currentApartmentId } = useAuth();
   const currentApartment = apartments?.find((a) => a.id === currentApartmentId);

   return (
      <div className="home">
         <h1>Dashboard</h1>
         {currentApartment && (
            <p className="home__apartment-label">Data for: {currentApartment.name}</p>
         )}
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
      </div>
   );
};

export default Home;
