import React from 'react';
import HeaderCrums from "../../components/HeaderCrums.tsx";
import AcountMenu from "./AccountMenu.tsx";
import NavLink from "../BaseLayout/Header/NavLink/NavLink.tsx";

interface NavbarProps {
  isHeaderShown?: boolean;
}

const Navbar: React.FC<NavbarProps> = (props) => {

    return (
      <header className={` flex w-full items-center ${props.isHeaderShown ? "justify-between" : "justify-end"}  rounded-tl-2xl rounded-tr-2xl px-4 py-4 backdrop-blur-lg`}>
        {
          props.isHeaderShown && (<HeaderCrums />)
        }
        <AcountMenu />
      </header>
    );
};

export default Navbar;