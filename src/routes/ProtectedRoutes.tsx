import {ProtectedRoutesWrapper} from "./ProtectedRoutesWrapper.tsx";
import Dashboard from "../pages/AdminPage/Dashboard";
import ChatBot from "../pages/ChatBot";
import WelcomePage from "../pages/ChatBot/WelcomePage.tsx";
import ChatArea from "../pages/ChatBot/ChatMessage/ChatArea.tsx";

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
            {
              path: "/cosmetic-assistant",
              element: <ChatBot/>,
              children: [
                {
                  path: "",
                  element: <WelcomePage/>,
                },
                {
                  path: ":sessionId",
                  element: <ChatArea />,
                }
              ]
            },
        ],
    },
];