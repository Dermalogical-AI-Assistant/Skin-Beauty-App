import LoginPage from "../pages/LoginPage";
import AdminLayout from "../layouts/Admin/AdminLayout.tsx";
import Dashboard from "../pages/AdminPage/Dashboard";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import UserManagement from "../pages/AdminPage/User";
import HomePage from "../pages/HomePage.tsx";
import ChatBot from "../pages/ChatBot";
import WelcomePage from "../pages/ChatBot/WelcomePage.tsx";
import ChatArea from "../pages/ChatBot/ChatArea.tsx";

export const routesForPublic = [
    {
        path: "/",
        element: <HomePage/>,
    },
    {
        path: "/login",
        element: <LoginPage/>,
    },
    {
        path: "/admin",
        element: <AdminLayout/>,
        children: [
            {
                path: "dashboard",
                element: <Dashboard/>,
            },
            {
                path: "users",
                element: <UserManagement/>,
            }
        ]
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
                element: <ChatArea/>,
            }
        ]
    },
    {
        path: "*",
        element: <NotFoundPage/>,
    }
];