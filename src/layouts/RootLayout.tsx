// src/layouts/RootLayout.tsx
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop.tsx";

const RootLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};

export default RootLayout;
