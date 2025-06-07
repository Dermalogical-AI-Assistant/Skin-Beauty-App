import React from "react";
import { Outlet } from "react-router-dom";
import UserFooter from "./Footer";
import UserHeader from "./Header";

interface UserBaseLayoutProps {
  isHeaderShown?: boolean;
  isFooterShown?: boolean;
}
const UserBaseLayout: React.FC<UserBaseLayoutProps> = (props) => {
  return (
    <div className={`bg-primary relative flex flex-col min-h-screen `}>
     <div className={`min-h-screen`}>
       {props.isHeaderShown && (
          <div className={`sticky top-0 z-50 w-full`}>
            <UserHeader />
          </div>
       )}
       <Outlet/>
     </div>
      { props.isFooterShown && (
        <div>
          <UserFooter />
        </div>
      )}
    </div>
  );
}

export default UserBaseLayout;