import {Navigate, Outlet, useLocation} from "react-router-dom";
import useAuthStore from "../stores/AuthStore";

/**
 * A wrapper component for protected routes
 * Ensures that the user is authenticated before allowing access to child routes
 * Redirects to the login page if user is not authenticated
 * @returns {JSX.Element} Either the Outlet component to render child routes or a Navigate component to redirect
 */
export const ProtectedRoutesWrapper = () => {
    const { accessToken } = useAuthStore();
    const location = useLocation(); // Lấy đường dẫn hiện tại


    // Check if the user is authenticated
    if (!accessToken) {
        // If not authenticated, redirect to the login page
        return <Navigate to="/login"  state={{ historyLocation : location }}  />;
    }

    // If authenticated, render the child routes
    return <Outlet />;
};