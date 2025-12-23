import { NavLink } from 'react-router-dom';
import MyIcon from '../icons/MyIcon';
import './sidebar.css';

const Sidebar = ({ isClosed }: { isClosed?: boolean }) => {
   if (isClosed) {
      return (
         <div className="sidebar-wrapper closed-sidebar">
            <h1 className="logo">C</h1>

            <nav className="sidebar ">
               <NavLink className="nav-link" to="/">
                  <MyIcon iconName="dashboard" />
               </NavLink>
               <NavLink className="nav-link" to="/payments">
                  <MyIcon iconName="payments" />
               </NavLink>
               <NavLink className="nav-link" to="/complaints">
                  <MyIcon iconName="complaints" />
               </NavLink>
               <NavLink className="nav-link" to="/loans">
                  <MyIcon iconName="loans" />
               </NavLink>
            </nav>

            <div className="sidebar-account">
               <NavLink className="nav-link" to="/settings">
                  <MyIcon iconName="settings" />
               </NavLink>
               <NavLink className="nav-link" to="/logout">
                  <MyIcon iconName="logout" />
               </NavLink>
            </div>
         </div>
      );
   }
   return (
      <div className="sidebar-wrapper">
         <h1 className="logo">Cimerat</h1>
         <nav className="sidebar">
            <NavLink to="/">
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
