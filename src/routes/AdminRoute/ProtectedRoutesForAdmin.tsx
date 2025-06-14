import Dashboard from "../../pages/AdminPage/Dashboard";
import ChatBot from "../../pages/ChatBot";
import WelcomePage from "../../pages/ChatBot/WelcomePage.tsx";
import ChatArea from "../../pages/ChatBot/ChatMessage/ChatArea.tsx";
import UserBaseLayout from "../../layouts/BaseLayout/UserBaseLayout.tsx";
import { ROUTE_CHECKOUT, ROUTE_MY_ORDER, ROUTE_ORDER_DETAILS } from "../../constants/routes.ts";
import CheckoutPage from "../../pages/CheckoutPage";
import OrdersPage from "../../pages/OrderPage";
import AdminLayout from "../../layouts/Admin/AdminLayout.tsx";
import UserManagement from "../../pages/AdminPage/User";
import ProductManagement from "../../pages/AdminPage/Product";
import { Outlet } from "react-router-dom";
import CreateProduct from "../../pages/AdminPage/Product/AddProduct.tsx";
import ProductDetails from "../../pages/AdminPage/Product/ProductDetails.tsx";
import CreateDiscount from "../../pages/AdminPage/Discount/CreateDiscount.tsx";
import Discount from "../../pages/AdminPage/Discount";
import DiscountDetails from "../../pages/AdminPage/Discount/DiscountDetails.tsx";
import OrderManagement from "../../pages/AdminPage/Order";
import { AdminProtectedRoutesWrapper } from "./ProtectedRoutesWrapper.tsx";
import ImportProductsBulk from "../../pages/AdminPage/Product/ImportProductBulk.tsx";

/**
 * Routes that require authentication
 * All routes defined here will be wrapped by the ProtectedRoutesWrapper
 * which verifies that the user is authenticated before allowing access
 * @type {Array<Object>}
 */
export const routesForAdminAuthenticated = [
  {
    path: "/",
    element: <AdminProtectedRoutesWrapper />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout/>,
        children: [
          {
            path: "",
            element: <Dashboard/>,
          },
          {
            path: "dashboard",
            element: <Dashboard/>,
          },
          {
            path: "users",
            element: <UserManagement/>,
          },
          {
            path: "products",
            element: <Outlet/>,
            children: [
              {
                path: "",
                element: <ProductManagement/>,
              },
              {
                path: "new-product",
                element: <CreateProduct/>,
              },
              {
                path: ":productId",
                element: <ProductDetails/>,
              },
              {
                path:"import",
                element: <ImportProductsBulk/>,
              }
            ]
          },
          {
            path: "discounts",
            element: <Outlet/>,
            children: [
              {
                path: "",
                element: <Discount/>,
              },
              {
                path: "new",
                element: <CreateDiscount/>,
              },
              {
                path: ":discountId",
                element: <DiscountDetails/>,
              },
              {
                CreateDiscount
              }
            ]
          },
          {
            path: "orders",
            element: <Outlet/>,
            children: [
              {
                path: "",
                element: <OrderManagement/>,
              },
            ]
          }
        ]
      },
      {
        path: "",
        element: <UserBaseLayout />,
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
            path: `${ROUTE_CHECKOUT}/:orderId`,
            element: <CheckoutPage />,
          },
          {
            path: `${ROUTE_ORDER_DETAILS}/:orderId`,
            element: <CheckoutPage />,
          },
          {
            path:ROUTE_MY_ORDER,
            element: <OrdersPage />,
          },
          {
            path: "/cosmetic-assistant",
            element: <ChatBot />,
            children: [
              {
                path: "",
                element: <WelcomePage />,
              },
              {
                path: ":sessionId",
                element: <ChatArea />,
              },
            ],
          },
        ],
      },
    ],
  },
];