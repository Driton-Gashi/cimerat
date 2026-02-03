import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MyIcon from '../icons/MyIcon';
import { useAuth } from '../../context/AuthContext';
import './header.css';

type P = {
   setIsSidebarClosed: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header = ({ setIsSidebarClosed }: P) => {
   const [userMenuOpen, setUserMenuOpen] = useState(false);
   const userMenuRef = useRef<HTMLDivElement>(null);
   const navigate = useNavigate();
   const { user, apartments, currentApartmentId, setCurrentApartment, logout } = useAuth();
   const currentApartment = apartments?.find((a) => a.id === currentApartmentId);
   const displayName = user ? [user.name, user.lastname].filter(Boolean).join(' ') : 'User';
   const initials = displayName
      .split(' ')
      .map((s) => s[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

   useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
         if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
            setUserMenuOpen(false);
         }
      };
      if (userMenuOpen) {
         document.addEventListener('click', handleClickOutside);
      }
      return () => document.removeEventListener('click', handleClickOutside);
   }, [userMenuOpen]);

   const handleLogout = () => {
      setUserMenuOpen(false);
      logout();
      navigate('/login', { replace: true });
   };

   return (
      <header className="header">
         <div className="header__left">
            <button
               type="button"
               className="header__menu-btn"
               onClick={() => setIsSidebarClosed((prev) => !prev)}
               aria-label="Toggle menu"
            >
               <MyIcon iconName="burger" />
            </button>
            <div className="header__search">
               <span className="header__search-icon" aria-hidden>
                  ⌕
               </span>
               <input
                  type="search"
                  placeholder="Search..."
                  className="header__search-input"
                  aria-label="Search"
               />
            </div>
         </div>

         <div className="header__right">
            {apartments && apartments.length > 1 && (
               <div className="header__apartment">
                  <label htmlFor="header-apartment-select" className="header__apartment-label">
                     Apartment
                  </label>
                  <select
                     id="header-apartment-select"
                     className="header__apartment-select"
                     value={currentApartmentId ?? ''}
                     onChange={(e) => {
                        const id = Number(e.target.value);
                        if (Number.isInteger(id)) setCurrentApartment(id);
                     }}
                  >
                     {apartments.map((a) => (
                        <option key={a.id} value={a.id}>
                           {a.name}
                        </option>
                     ))}
                  </select>
               </div>
            )}

            <button type="button" className="header__icon-btn" aria-label="Notifications">
               <MyIcon iconName="bell" />
            </button>

            <div className="header__language">
               <img src="/flags/en.png" alt="" className="header__language-flag" />
               <select className="header__language-select" aria-label="Language">
                  <option value="en">EN</option>
                  <option value="sq">SQ</option>
               </select>
            </div>

            <div className="header__user-wrapper" ref={userMenuRef}>
               <button
                  type="button"
                  className={`header__user ${userMenuOpen ? 'header__user--open' : ''}`}
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
               >
                  <div className="header__avatar" title={displayName}>
                     {initials || '?'}
                  </div>
                  <div className="header__user-info">
                     <span className="header__user-name">{displayName}</span>
                     <span className="header__user-role">{currentApartment?.role ?? 'member'}</span>
                  </div>
                  <span className="header__user-chevron">
                     <MyIcon iconName="chevronDown" />
                  </span>
               </button>
               {userMenuOpen && (
                  <div className="header__user-dropdown" role="menu">
                     <Link
                        to="/settings"
                        className="header__user-dropdown-item"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                     >
                        <MyIcon iconName="settings" />
                        <span>Settings</span>
                     </Link>
                     {user?.global_role === 'platform_admin' && (
                        <Link
                           to="/admin"
                           className="header__user-dropdown-item"
                           role="menuitem"
                           onClick={() => setUserMenuOpen(false)}
                        >
                           <MyIcon iconName="dashboard" />
                           <span>Admin dashboard</span>
                        </Link>
                     )}
                     <button
                        type="button"
                        className="header__user-dropdown-item header__user-dropdown-item--logout"
                        role="menuitem"
                        onClick={handleLogout}
                     >
                        <MyIcon iconName="logout" />
                        <span>Log out</span>
                     </button>
                  </div>
               )}
            </div>
         </div>
      </header>
   );
};

export default Header;
