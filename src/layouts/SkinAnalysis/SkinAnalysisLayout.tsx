import { PiBasket } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import BrandLogo from "../../components/BrandLogo";
import NavLink from "../BaseLayout/Header/NavLink/NavLink";
import Search from "../BaseLayout/Header/Search";
import BasketList from "../BaseLayout/Header/BasketList";
import AcountMenu from "../BaseLayout/Header/AccountMenu";
import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Index from "../BaseLayout/Header";

interface LayoutProps {
  children?: ReactNode;
}

const SkinAnalysisLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={`h-screen`}>
        {children || <Outlet />}
    </div>
  );
};

export default SkinAnalysisLayout;
