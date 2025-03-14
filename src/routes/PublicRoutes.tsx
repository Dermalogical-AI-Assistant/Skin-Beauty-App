import LoginPage from "../pages/LoginPage";

/**
 * Public routes that are accessible to all users, regardless of authentication status
 * These routes do not require users to be logged in
 * @type {Array<Object>}
 */
export const routesForPublic = [
    {
        path: "/",
        element: <div>Home Page</div>,
    },
    {
        path: "/login",
        element: <LoginPage/>,
    },
];