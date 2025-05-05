import LoginPage from "../pages/LoginPage";
import AdminLayout from "../layouts/Admin/AdminLayout.tsx";
import Dashboard from "../pages/AdminPage/Dashboard";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import UserManagement from "../pages/AdminPage/User";
import HomePage from "../pages/HomePage.tsx";
import ChatBot from "../pages/ChatBot";
import WelcomePage from "../pages/ChatBot/WelcomePage.tsx";
import ChatArea from "../pages/ChatBot/ChatMessage/ChatArea.tsx";
import SkinAnalysisLayout from "../layouts/SkinAnalysis/SkinAnalysisLayout.tsx";
import UploadSkinPhoto from "../pages/SkinAnalysisPage/UploadSkinPhoto/index.tsx";
import SkinPhoto from "../pages/SkinAnalysisPage/SkinPhoto/index.tsx";
import SkinAnalysisResult from "../pages/SkinAnalysisPage/SkinAnalysisResult/index.tsx";

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
        path: "/skin-analysis",
        element: <SkinAnalysisLayout/>,
        children: [
            {
                path: "",
                element: <UploadSkinPhoto/>,
            },
            {
                path: "skin-photo",
                element: <SkinPhoto/>
            },
            {
                path: "result",
                element: <SkinAnalysisResult/>
            }
        ]
    },
    {
        path: "*",
        element: <NotFoundPage/>,
    }
];