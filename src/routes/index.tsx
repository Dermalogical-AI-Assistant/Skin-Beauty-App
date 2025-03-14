import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {routesForPublic} from "./PublicRoutes.tsx";
import {routesForAuthenticated} from "./ProtectedRoutes.tsx";

/**
 * Routes component that sets up the application's routing structure
 * Combines public and authenticated routes into a single router
 * @returns {JSX.Element} RouterProvider component with configured routes
 */
const Routes = () => {
    /**
     * Create a browser router instance with all application routes
     */
    const router = createBrowserRouter([
        ...routesForPublic,
        ...routesForAuthenticated,
    ]);

    return <RouterProvider router={router} />;
};

export default Routes;