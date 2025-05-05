import React from 'react';
import HeaderCrums from "../../components/HeaderCrums.tsx";
import AcountMenu from "./AccountMenu.tsx";


const Navbar: React.FC = () => {

    return (
        <header className="h-16 w-full flex items-center justify-between px-4">
            <HeaderCrums/>
            <AcountMenu/>
        </header>
    );
};

export default Navbar;