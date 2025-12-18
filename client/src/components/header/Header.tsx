import MyIcon from '../icons/MyIcon';
import './header.css';

const Header = () => {
   return (
      <header className="header-wrapper">
         <div className="burger-search">
            <MyIcon iconName="burger" />

         </div>
      </header>
   );
};

export default Header;
