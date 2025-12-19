import MyIcon from '../../components/icons/MyIcon';
import OverviewCard from '../../components/dashboard/overview-card/OverviewCard';
import ApexChart from '../../components/dashboard/chart/ApexChart';
import './home.css';

const Home = () => {
   return (
      <div className="home">
         <h1>Dashboard</h1>
         <div className="dashboard-overview">
            <OverviewCard>
               <div className="dashboard-overview-card-top">
                  <div className="dashboard-overview-card-top-left">
                     <h4>Total Users</h4>
                     <h2>40.689</h2>
                  </div>
                  <div className="dashboard-overview-card-top-right">
                     <img src="/users.png" />
                  </div>
               </div>
               <div className="dashboard-overview-card-bottom">
                  <p>
                     <MyIcon iconName="dashboardArrow" /> <span className="green-text">8.5%</span>
                     <span>Up from yesterday</span>
                  </p>
               </div>
            </OverviewCard>

            <OverviewCard>
               <div className="dashboard-overview-card-top">
                  <div className="dashboard-overview-card-top-left">
                     <h4>Total Users</h4>
                     <h2>40.689</h2>
                  </div>
                  <div className="dashboard-overview-card-top-right">
                     <img src="/users.png" />
                  </div>
               </div>
               <div className="dashboard-overview-card-bottom">
                  <p>
                     <MyIcon iconName="dashboardArrow" /> <span className="green-text">8.5%</span>
                     <span>Up from yesterday</span>
                  </p>
               </div>
            </OverviewCard>

            <OverviewCard>
               <div className="dashboard-overview-card-top">
                  <div className="dashboard-overview-card-top-left">
                     <h4>Total Users</h4>
                     <h2>40.689</h2>
                  </div>
                  <div className="dashboard-overview-card-top-right">
                     <img src="/users.png" />
                  </div>
               </div>
               <div className="dashboard-overview-card-bottom">
                  <p>
                     <MyIcon iconName="dashboardArrow" /> <span className="green-text">8.5%</span>
                     <span>Up from yesterday</span>
                  </p>
               </div>
            </OverviewCard>

            <OverviewCard>
               <div className="dashboard-overview-card-top">
                  <div className="dashboard-overview-card-top-left">
                     <h4>Total Users</h4>
                     <h2>40.689</h2>
                  </div>
                  <div className="dashboard-overview-card-top-right">
                     <img src="/users.png" />
                  </div>
               </div>
               <div className="dashboard-overview-card-bottom">
                  <p>
                     <MyIcon iconName="dashboardArrow" /> <span className="green-text">8.5%</span>
                     <span>Up from yesterday</span>
                  </p>
               </div>
            </OverviewCard>
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
