import React, { useEffect, useState } from "react";
import "@mantine/core/styles.css";
import useAdminProduct from "../../../hooks/useAdminProduct.tsx";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AdminContentLayout from "../../../layouts/Admin/ContentLayout.tsx";
import useOrder from "../../../hooks/useOrder.ts";
import { E_OrderOrderBy, E_OrderStatus, OrderStatus } from "../../../types/Order.ts";
import TabContent from "../../../components/Tab/TabContent.tsx";
import OrderPageItems from "../../OrderPage/OrderPageItems.tsx";
import Tab from "../../../components/Tab";

const OrderManagement: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<E_OrderOrderBy>(E_OrderOrderBy.CREATED_AT);
  const [status, setStatus] = useState<E_OrderStatus>();
  const {getProducts} = useAdminProduct();
  const navigate = useNavigate();

  const {getOrders} = useOrder();

  // Get current tab from URL params
  const currentTab = searchParams.get('tab');

  const {
    data: pendingData,
    isLoading: isPendingLoading,
    refetch: refreshPendingOrders,
  } = getOrders({
    page: 0,
    perPage: 1,
    status: E_OrderStatus.PENDING
  });

  const [pendingDataCount, setPendingDataCount] = useState(0);

  useEffect(() => {
    if (pendingData) {
      setPendingDataCount(pendingData?.meta.total || 0);
    }
  }, [pendingData]);

  // Initialize status based on URL param
  useEffect(() => {
    if (currentTab) {
      setStatus(currentTab as E_OrderStatus);
    } else {
      setStatus(undefined); // For "All" tab
    }
  }, [currentTab]);

  const {
    data: orders,
    isLoading,
    refetch: refreshOrders,
  } = getOrders({
    page: page,
    perPage: perPage,
    order: `${orderBy}:${direction}`,
    status
  });

  const handleTabChange = (value?: OrderStatus) => {
    setStatus(value);
    setPage(0);

    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set('tab', value);
    } else {
      newSearchParams.delete('tab'); // Remove tab param for "All"
    }
    setSearchParams(newSearchParams);

    // Refresh orders after state update
    setTimeout(() => {
      refreshOrders();
    }, 0);
  };

  useEffect(() => {
    if (orders) {
      console.log("Orders fetched:", orders);
    }
  }, [orders]);

  const tabs = [
    {
      label: "All",
      value: undefined, // Changed from null to undefined for consistency
      content: (
        <TabContent>
          <div className="space-y-4">
            <OrderPageItems orderData={orders} refreshOrder={refreshOrders} loadMore={() => {}} />
          </div>
        </TabContent>
      )
    },
    {
      label: "Processing",
      value: "PENDING",
      alertCount: pendingDataCount,
      content: (
        <TabContent>
          <div className="space-y-4">
            <OrderPageItems orderData={orders} refreshOrder={refreshOrders} loadMore={() => {}} />
          </div>
        </TabContent>
      )
    },
    {
      label: "Confirmed",
      value: "CONFIRMED",
      content: (
        <TabContent>
          <div className="space-y-4">
            <OrderPageItems orderData={orders} refreshOrder={refreshOrders} loadMore={() => {}} />
          </div>
        </TabContent>
      )
    },
    {
      label: "Shipping",
      value: "SHIPPING",
      content: (
        <TabContent>
          <div className="space-y-4">
            <OrderPageItems orderData={orders} refreshOrder={refreshOrders} loadMore={() => {}} />
          </div>
        </TabContent>
      )
    },
    {
      label: "Delivered",
      value: "DELIVERED",
      content: (
        <TabContent>
          <div className="space-y-4">
            <OrderPageItems orderData={orders} refreshOrder={refreshOrders} loadMore={() => {}} />
          </div>
        </TabContent>
      )
    },
    {
      label: "Canceled",
      value: "CANCELED",
      content: (
        <TabContent>
          <div className="space-y-4">
            <OrderPageItems orderData={orders} refreshOrder={refreshOrders} loadMore={() => {}} />
          </div>
        </TabContent>
      )
    }
  ];

  return (
    <AdminContentLayout title={"Orders Management"} subtitle={"Manage all orders in the store"}>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-white/50 text-primary-dark rounded-lg">
            <Tab
              tabs={tabs}
              top="25"
              activeTab={currentTab} // Pass current tab from URL
              onTabChange={handleTabChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </AdminContentLayout>
  );
};

export default OrderManagement;