import NavLinkItem from "./NavLinkItem.tsx";

export const navLinks = [
  {
    to: "/products",
    label: "Products",
  },
  {
    to: "/admin/users",
    label: "Blogs",
  },
  {
    to: "/admin/users",
    label: "Manufacturing",
  },
  {
    to: "/admin/users",
    label: "Packaging",
  },
  {
    to: "/",
    label: "Home",
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
