import LoginPage from "../pages/LoginPage";
import AdminLayout from "../layouts/Admin/AdminLayout.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import UserManagement from "../pages/AdminPage/User";
import HomePage from "../pages/HomePage/HomePage.tsx";
import SkinAnalysisLayout from "../layouts/SkinAnalysis/SkinAnalysisLayout.tsx";
import UploadSkinPhoto from "../pages/SkinAnalysisPage/UploadSkinPhoto/index.tsx";
import SkinPhoto from "../pages/SkinAnalysisPage/SkinPhoto/index.tsx";
import SkinAnalysisResult from "../pages/SkinAnalysisPage/SkinAnalysisResult/index.tsx";
import ProductsPage from "../pages/Products";
import UserBaseLayout from "../layouts/BaseLayout/UserBaseLayout.tsx";
import { Outlet } from "react-router-dom";
import ProductDetails from "../pages/Products/ProductDetails.tsx";
import ShoppingBasket from "../pages/ShoppingBasket";
import { ROUTE_BASKET } from "../constants/routes.ts";
import ProductManagement from "../pages/AdminPage/Product";
import TestPage from "../pages/Dashboard.tsx";

export const routesForPublic = [

    {
      path: "/",
      element: <UserBaseLayout/>,
      children: [
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "test",
          element: <TestPage />,
        },
        {
          path: ROUTE_BASKET,
          element: <ShoppingBasket />,
        },
        {
          path: "/products",
          element: <Outlet/>,
          children: [
            {
              path:"",
              element: <ProductsPage />
            },
            {
              path: ":id",
              element: <ProductDetails/>,
            },
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
      ]
    },
    {
        path: "/login",
        element: <LoginPage/>,
    }
];