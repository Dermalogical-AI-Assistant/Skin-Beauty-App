import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface LayoutProps {
  children?: ReactNode;
}

const SkinAnalysisLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={``}>
        {children || <Outlet />}
    </div>
  );
};

export default SkinAnalysisLayout;
