import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import HomePage from "../pages/HomePage/HomePage.tsx";
import ProductsPage from "../pages/Products";
import UserBaseLayout from "../layouts/BaseLayout/UserBaseLayout.tsx";
import { Outlet } from "react-router-dom";
import ProductDetails from "../pages/Products/ProductDetails.tsx";
import ShoppingBasket from "../pages/ShoppingBasket";
import { ROUTE_BASKET } from "../constants/routes.ts";
import TestPage from "../pages/Dashboard.tsx";
import SignUpPage from "../pages/SignUpPage";

export const routesForPublic = [

    {
      path: "/",
      element: <UserBaseLayout isHeaderShown={true} isFooterShown={true} />,
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
          path: "*",
          element: <NotFoundPage/>,
        }
      ]
    },
    {
        path: "/login",
        element: <LoginPage/>,
    },
    {
      path:"/register",
      element:<SignUpPage/>
    }
];