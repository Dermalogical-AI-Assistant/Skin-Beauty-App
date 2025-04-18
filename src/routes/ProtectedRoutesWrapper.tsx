import {Navigate, Outlet, useLocation} from "react-router-dom";
import useAuthStore from "../stores/AuthStore";

export const ProtectedRoutesWrapper = () => {
    const { accessToken } = useAuthStore();
    const location = useLocation(); // Lấy đường dẫn hiện tại

    if (!accessToken) {
        return <Navigate to="/login"  state={{ historyLocation : location }}  />;
    }

    // If authenticated, render the child routes
    return <Outlet />;
};