import {ProtectedRoutesWrapper} from "./ProtectedRoutesWrapper.tsx";
import Dashboard from "../pages/AdminPage/Dashboard";

/**
 * Routes that require authentication
 * All routes defined here will be wrapped by the ProtectedRoutesWrapper
 * which verifies that the user is authenticated before allowing access
 * @type {Array<Object>}
 */
export const routesForAuthenticated = [
    {
        path: "/",
        element: <ProtectedRoutesWrapper />,
        children: [
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
            {
                path: "/logout",
                element: <>hello from logout</>,
            },
        ],
    },
];