import MyIcon from '../icons/MyIcon';
import './header.css';

const Header = () => {
   return (
      <header>
         <div className="headerLeft">
            <MyIcon iconName="burger" />
            <input type="text" placeholder="search" />
         </div>
         <div className="headerRight">
            <MyIcon iconName="bell" />
            <div className="language-switcher">
               <img height={20} src="/flags/en.png" />
               <select>
                  <option value="en">English</option>
                  <option value="en">Albanian</option>
                  <option value="en">...</option>
               </select>
            </div>
            <div className="profile-wrapper">
               <img src="/profile.png" alt="" />
               <div>
                  <h3 className="username">Driton</h3>
                  <p className="user-role">admin</p>
               </div>
               <MyIcon iconName="downArrow" />
            </div>
         </div>
      </header>
   );
};

export default Header;
