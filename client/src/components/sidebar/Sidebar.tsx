import { NavLink } from 'react-router-dom';
import MyIcon from '../icons/MyIcon';
import './sidebar.css'

const Sidebar = () => {
   return (
    <div className="sidebar-wrapper">
  <nav className="sidebar">
    <NavLink to="/" end>
      {({ isActive }) => (
        <div className={`nav-link ${isActive ? 'active' : ''}`}>
          <MyIcon iconName="dashboard" />
          <span>Dashboard</span>
        </div>
      )}
    </NavLink>

    <NavLink to="/payments">
      {({ isActive }) => (
        <div className={`nav-link ${isActive ? 'active' : ''}`}>
          <MyIcon iconName="payments" />
          <span>Payments</span>
        </div>
      )}
    </NavLink>

    <NavLink to="/complaints">
      {({ isActive }) => (
        <div className={`nav-link ${isActive ? 'active' : ''}`}>
          <MyIcon iconName="complaints" />
          <span>Complaints</span>
        </div>
      )}
    </NavLink>

    <NavLink to="/loans">
      {({ isActive }) => (
        <div className={`nav-link ${isActive ? 'active' : ''}`}>
          <MyIcon iconName="loans" />
          <span>Loans</span>
        </div>
      )}
    </NavLink>
  </nav>

  <div className="sidebar-account">
    <NavLink to="/settings">
      {({ isActive }) => (
        <div className={`nav-link ${isActive ? 'active' : ''}`}>
          <MyIcon iconName="settings" />
          <span>Settings</span>
        </div>
      )}
    </NavLink>

    <NavLink to="/logout">
      {({ isActive }) => (
        <div className={`nav-link ${isActive ? 'active' : ''}`}>
          <MyIcon iconName="logout" />
          <span>Logout</span>
        </div>
      )}
    </NavLink>
  </div>
</div>

   );
};

export default Sidebar;
