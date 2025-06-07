import {ProtectedRoutesWrapper} from "./ProtectedRoutesWrapper.tsx";
import Dashboard from "../../pages/AdminPage/Dashboard";
import ChatBot from "../../pages/ChatBot";
import WelcomePage from "../../pages/ChatBot/WelcomePage.tsx";
import ChatArea from "../../pages/ChatBot/ChatMessage/ChatArea.tsx";
import UserBaseLayout from "../../layouts/BaseLayout/UserBaseLayout.tsx";
import { ROUTE_CHECKOUT, ROUTE_MY_ORDER, ROUTE_ORDER_DETAILS } from "../../constants/routes.ts";
import CheckoutPage from "../../pages/CheckoutPage";
import OrdersPage from "../../pages/OrderPage";
import { AdminProtectedRoutesWrapper } from "../AdminRoute/ProtectedRoutesWrapper.tsx";
import AdminLayout from "../../layouts/Admin/AdminLayout.tsx";
import ChatLayout from "../../layouts/BaseLayout/ChatLayout.tsx";

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
        path: "",
        element: <UserBaseLayout isFooterShown={true} isHeaderShown={true} />,
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
          }
        ],
      },
      {
        path: "",
        element: <ChatLayout />,
        children: [

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