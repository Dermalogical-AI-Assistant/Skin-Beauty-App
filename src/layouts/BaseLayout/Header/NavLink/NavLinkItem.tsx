import { useLocation, NavLink as RouterNavLink } from "react-router-dom";

interface NavLinkItemProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

const NavLinkItem: React.FC<NavLinkItemProps> = ({ to, label, icon }) => {
  const location = useLocation();
  // const isActive = location.pathname === to;
  const isActive = false;

  return (
    <RouterNavLink
      to={to}
      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:border-b-4 border-pink-light
        ${isActive ? "border-b-4 border-pink-light" : "text-gray-700"}
      `}
    >
      {icon && <span>{icon}</span>}
      <span className={`font-encode-sans font-normal text-lg drop-shadow-md"`}>{label}</span>
    </RouterNavLink>
  );
};

export default NavLinkItem;
