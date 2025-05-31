import {Navigate, Outlet, useLocation} from "react-router-dom";
import useAuthStore from "../../stores/AuthStore.ts";
import { E_PageRoleType } from "../../types/SystemType.ts";

export const ProtectedRoutesWrapper = () => {
    const { isLogin } = useAuthStore();
    const location = useLocation();
    localStorage.setItem("pageRole", E_PageRoleType.USER);

    if (!isLogin) {
        return <Navigate to="/login"  state={{ historyLocation : location }}  />;
    }

    // If authenticated, render the child routes
    return <Outlet />;
};