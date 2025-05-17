import NavLinkItem from "./NavLinkItem.tsx";
import { ROUTE_CHATBOT, ROUTE_MY_ORDERS, ROUTE_PRODUCTS, ROUTE_SKIN_ANALYSIS } from "../../../../constants/routes.ts";

export const navLinks = [
  {
    to: ROUTE_PRODUCTS,
    label: "Products",
  },
  {
    to: ROUTE_SKIN_ANALYSIS,
    label: "Skin Analysis",
  },
  {
    to: ROUTE_CHATBOT,
    label: "AI Assistant",
  },{
    to: ROUTE_MY_ORDERS,
    label: "Orders",
  }
];

const NavLink: React.FC = () => {
  return (
    <header className="flex items-center gap-6 px-6 py-4">
      {navLinks.map((item, index) => (
        <NavLinkItem key={index} {...item} />
      ))}
    </header>
  );
};

export default NavLink;
