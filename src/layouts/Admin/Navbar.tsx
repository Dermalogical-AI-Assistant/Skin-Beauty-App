import React from 'react';
import HeaderCrums from "../../components/HeaderCrums.tsx";
import AcountMenu from "./AccountMenu.tsx";


const Navbar: React.FC = () => {

    return (
        <header className="w-full flex items-center justify-between px-4 py-4 backdrop-blur-lg  rounded-tl-2xl rounded-tr-2xl">
            <HeaderCrums/>
            <AcountMenu/>
        </header>
    );
};

export default Navbar;