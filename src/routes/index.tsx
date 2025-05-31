import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {routesForPublic} from "./PublicRoutes.tsx";
import {routesForAuthenticated} from "./UserProtectedRoute/ProtectedRoutes.tsx";
import RootLayout from "../layouts/RootLayout.tsx";
import { routesForAdminAuthenticated } from "./AdminRoute/ProtectedRoutesForAdmin.tsx";

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
      {
        path: "/",
        element: <RootLayout />,
        children: [
          ...routesForPublic,
          ...routesForAuthenticated,
          ...routesForAdminAuthenticated
        ],
      },
    ]);

    return <RouterProvider router={router} />;
};

export default Routes;