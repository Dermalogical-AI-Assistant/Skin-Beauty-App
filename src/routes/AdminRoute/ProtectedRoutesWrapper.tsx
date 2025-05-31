import {Navigate, Outlet, useLocation} from "react-router-dom";
import useAuthStore from "../../stores/AuthStore";
import { E_PageRoleType } from "../../types/SystemType.ts";

export const AdminProtectedRoutesWrapper = () => {
    const { isLogin } = useAuthStore();
    const location = useLocation();
    localStorage.setItem("pageRole", E_PageRoleType.ADMIN);

    if (!isLogin) {
        return <Navigate to="/login"  state={{ historyLocation : location }}  />;
    }

    // If authenticated, render the child routes
    return <Outlet />;
};