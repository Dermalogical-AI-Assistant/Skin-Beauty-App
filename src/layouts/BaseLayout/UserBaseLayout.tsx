import React from "react";
import { Outlet } from "react-router-dom";
import UserFooter from "./Footer";
import UserHeader from "./Header";

const UserBaseLayout: React.FC = () => {
  return (
    <div className={`bg-primary relative flex flex-col min-h-screen `}>
      <div className={`sticky top-0 z-10 w-full`}>
        <UserHeader />
      </div>
      <Outlet/>
      <div>
        <UserFooter/>
      </div>
    </div>
  );
}

export default UserBaseLayout;