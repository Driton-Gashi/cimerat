import './header.css';
type HeaderProps = {
   children: React.ReactNode;
};

const Header = ({ children }: HeaderProps) => {
   return <header>{children}</header>;
};

export default Header;
