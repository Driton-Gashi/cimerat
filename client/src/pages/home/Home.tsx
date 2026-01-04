import OverviewCard from '../../components/dashboard/overview-card/OverviewCard';
import ApexChart from '../../components/dashboard/chart/ApexChart';
import './home.css';
import DashboardOverviewCardCimerat from '../../components/dashboard/overview-card/cimerat/DashboardOverviewCardCimerat';

const Home = () => {
   return (
      <div className="home">
         <h1>Dashboard</h1>
         <div className="dashboard-overview">
            <DashboardOverviewCardCimerat />
            <DashboardOverviewCardCimerat />
            <DashboardOverviewCardCimerat />
            <DashboardOverviewCardCimerat />
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
