import {Navigate, Outlet, useLocation} from "react-router-dom";
import useAuthStore from "../stores/AuthStore";

export const ProtectedRoutesWrapper = () => {
    const { isLogin } = useAuthStore();
    const location = useLocation();

    if (!isLogin) {
        return <Navigate to="/login"  state={{ historyLocation : location }}  />;
    }

    // If authenticated, render the child routes
    return <Outlet />;
};