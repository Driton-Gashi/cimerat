import { NavLink } from 'react-router-dom';
import MyIcon from '../icons/MyIcon';
import './sidebar.css'

const Sidebar = () => {
   return (
    <div className='sidebar-wrapper'>
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
      <div className="sidebar-account">
        <div className="nav-link">
            <MyIcon iconName="settings" />
            <NavLink to="/loans">Settings</NavLink>
         </div>
         <div className="nav-link">
            <MyIcon iconName="logout" />
            <NavLink to="/loans">Logout</NavLink>
         </div>
      </div>
    </div>
   );
};

export default Sidebar;
