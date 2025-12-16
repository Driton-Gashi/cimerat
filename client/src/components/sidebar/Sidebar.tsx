import { NavLink } from 'react-router-dom';
import MyIcon from '../icons/MyIcon';

const Sidebar = () => {
   return (
      <nav className="sidebar">
         <div className="nav-link">
            <MyIcon iconName="dashboard" />
            <NavLink to="/" end>
               Dashboard
            </NavLink>
         </div>
         <div className="nav-link">
            <MyIcon iconName="payments" />
            <NavLink to="/payments">Payments</NavLink>
         </div>
         <div className="nav-link">
            <MyIcon iconName="complaints" />
            <NavLink to="/complaints">Complaints</NavLink>
         </div>
         <div className="nav-link">
            <MyIcon iconName="loans" />
            <NavLink to="/loans">Loans</NavLink>
         </div>
      </nav>
   );
};

export default Sidebar;
