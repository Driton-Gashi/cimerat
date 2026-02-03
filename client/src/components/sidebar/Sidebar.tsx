import { NavLink, useNavigate } from 'react-router-dom';
import MyIcon from '../icons/MyIcon';
import { useAuth } from '../../context/AuthContext';
import './sidebar.css';

const Sidebar = ({ isClosed }: { isClosed?: boolean }) => {
   const { user, logout } = useAuth();
   const navigate = useNavigate();

   const handleLogout = () => {
      logout();
      navigate('/login', { replace: true });
   };

   const navLink = (to: string, icon: string, label: string) =>
      isClosed ? (
         <NavLink className="nav-link" to={to}>
            <MyIcon iconName={icon as any} />
         </NavLink>
      ) : (
         <NavLink to={to}>
            {({ isActive }) => (
               <div className={`nav-link ${isActive ? 'active' : ''}`}>
                  <MyIcon iconName={icon as any} />
                  {!isClosed && <span>{label}</span>}
               </div>
            )}
         </NavLink>
      );

   if (isClosed) {
      return (
         <div className="sidebar-wrapper closed-sidebar">
            <h1 className="logo">C</h1>
            <nav className="sidebar">
               {navLink('/', 'dashboard', 'Dashboard')}
               {navLink('/payments', 'payments', 'Payments')}
               {navLink('/complaints', 'complaints', 'Complaints')}
               {navLink('/loans', 'loans', 'Loans')}
               {user?.global_role === 'platform_admin' && navLink('/admin', 'dashboard', 'Admin')}
            </nav>
            <div className="sidebar-account">
               {navLink('/settings', 'settings', 'Settings')}
               <button type="button" className="nav-link sidebar-logout-btn" onClick={handleLogout}>
                  <MyIcon iconName="logout" />
                  {!isClosed && <span>Logout</span>}
               </button>
            </div>
         </div>
      );
   }

   return (
      <div className="sidebar-wrapper">
         <h1 className="logo">Cimerat</h1>
         <nav className="sidebar">
            {navLink('/', 'dashboard', 'Dashboard')}
            {navLink('/payments', 'payments', 'Payments')}
            {navLink('/complaints', 'complaints', 'Complaints')}
            {navLink('/loans', 'loans', 'Loans')}
            {user?.global_role === 'platform_admin' && navLink('/admin', 'dashboard', 'Admin')}
         </nav>
         <div className="sidebar-account">
            {navLink('/settings', 'settings', 'Settings')}
            <button type="button" className="nav-link sidebar-logout-btn" onClick={handleLogout}>
               <MyIcon iconName="logout" />
               <span>Logout</span>
            </button>
         </div>
      </div>
   );
};

export default Sidebar;
