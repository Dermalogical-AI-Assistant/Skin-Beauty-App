import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider.tsx";

/**
 * A wrapper component for protected routes
 * Ensures that the user is authenticated before allowing access to child routes
 * Redirects to the login page if user is not authenticated
 * @returns {JSX.Element} Either the Outlet component to render child routes or a Navigate component to redirect
 */
export const ProtectedRoutesWrapper = () => {
    const { token } = useAuth();

    // Check if the user is authenticated
    if (!token) {
        // If not authenticated, redirect to the login page
        return <Navigate to="/login" />;
    }

    // If authenticated, render the child routes
    return <Outlet />;
};