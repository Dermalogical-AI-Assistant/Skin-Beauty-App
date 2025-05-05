import { PiBasket } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import BrandLogo from "../../components/BrandLogo";
import NavLink from "../BaseLayout/Header/NavLink/NavLink";
import Search from "../BaseLayout/Header/Search";
import BasketList from "../BaseLayout/Header/BasketList";
import AcountMenu from "../BaseLayout/Header/AccountMenu";
import { ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface LayoutProps {
  children?: ReactNode;
}

const SkinAnalysisLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="bg-primary flex h-20 w-full items-center px-14 shadow-[0px_21px_42px_rgba(234,165,141,0.15)]">
        <div className="flex flex-1 items-center">
          <BrandLogo />
        </div>

        <div className="flex flex-1 justify-center">
          <NavLink />
        </div>

        <div className="flex flex-1 items-center justify-end gap-6">
          <Search icon={<IoSearchOutline size={24} />} />
          <BasketList icon={<PiBasket size={24} />} />
          <AcountMenu />
        </div>
      </header>

      <main className="flex-1 p-8">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default SkinAnalysisLayout;
