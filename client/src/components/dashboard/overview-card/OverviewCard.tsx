import './overviewCard.css';

const OverviewCard = ({ children }: { children: React.ReactNode }) => {
   return <div className="dashboard-overview-card">{children}</div>;
};

export default OverviewCard;
