import React from 'react';
import { Store, ShoppingBag, Package, Clock, Truck, CheckCircle, XCircle, RefreshCw} from "lucide-react";
import { E_OrderStatus, Order, OrderStatus } from "../../types/Order.ts";
import { GenericResponseType } from "../../types/common.ts";
import { Link } from "react-router-dom";
import { ROUTE_CHECKOUT, ROUTE_MY_ORDER, ROUTE_ORDER_DETAILS } from "../../constants/routes.ts";
import useOrders, { ReqModifyOrder } from "../../hooks/useOrder.ts";

interface OrderPageProps {
  orderData?: GenericResponseType<Order>;
  refreshOrder: () => void;
  loadMore: () => void;
}

const OrderPage:React.FC<OrderPageProps> = (props) => {

  const {isLoading, onRequestUpdateOrder } = useOrders();

  const handleCancelOrder = (orderId:string) => {
    const modifyData = {
      orderId: orderId,
      modifyData:{
        status:E_OrderStatus.CANCELED,
      }
    } as ReqModifyOrder;

    onRequestUpdateOrder(
      modifyData,
      ()=>{
        console.log("Address updated successfully");
        props.refreshOrder();
      },
      (error) => {
        console.error("Error updating address:", error);
      }
    )
  }

  const isCanLoadMore = () => {
    const page = props?.orderData?.meta?.page || 1;
    const totalPage = Math.ceil(props?.orderData?.meta?.total / props?.orderData?.meta?.perPage);
    console.log("page",page);
    console.log("totalPage",totalPage);
    return page < totalPage;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DRAF':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'PROCESSING':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'SHIPPING':
        return <Truck className="w-4 h-4 text-purple-500" />;
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'REFUND':
        return <RefreshCw className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'DRAF':
        return 'Draf';
      case 'PENDING':
        return 'Processing';
      case 'SHIPPING':
        return 'Shipping';
      case 'DELIVERED':
        return 'Completed';
      case 'CANCELED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'DRAF':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPING':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString:string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!props.orderData || !props.orderData.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="mx-auto max-w-7xl p-4">
        {/* Orders List */}
        <div className="space-y-6">
          {props.orderData.data.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-lg bg-white/60 shadow-sm"
            >
              {/* Order Header */}
              <div className="bg-pink-light/10 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-primary-dark text-sm font-medium">
                          Order #{order.id.slice(-8)}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1">
                            {getStatusText(order.status)}
                          </span>
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {order.orderItems.length} items
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
                  {/* Left Column - Shipping Address & Payment */}
                  <div className="space-y-6 lg:col-span-2">
                    {/* Order Items */}
                    <div className="rounded-lg border border-gray-200 p-4">
                      <h3 className="text-primary-dark mb-4 flex items-center text-sm font-semibold">
                        <ShoppingBag className="mr-2 h-4 w-4 text-orange-600" />
                        Order Items
                      </h3>
                      <div className="space-y-4">
                        {order.orderItems.map((orderItem) => (
                          <div
                            key={orderItem.id}
                            className="flex items-start space-x-3 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                          >
                            <img
                              src={
                                orderItem?.product?.thumbnail ||
                                "/api/placeholder/80/80"
                              }
                              alt={orderItem?.product?.title || "Product"}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="text-primary-dark mb-1 text-sm font-medium">
                                {orderItem?.product?.title || "Product"}
                              </h4>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                  Quantity: {orderItem?.quantity}
                                </span>
                                <div className={`flex flex-col items-end`}>
                                  <span className="text-primary-dark text-lg font-bold">
                                    £{orderItem.finalPrice.toFixed(2)}
                                  </span>
                                  <p className="mb-3 text-sm text-gray-500">
                                    £{" "}
                                    {(
                                      orderItem.finalPrice / orderItem.quantity
                                    ).toFixed(2)}{" "}
                                    each
                                  </p>
                                </div>
                              </div>
                              {orderItem.note && (
                                <p className="mt-1 text-xs text-gray-500">
                                  Note: {orderItem.note}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* order Summary */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center justify-end gap-3 rounded-lg bg-white/80">
                      {/* Action Buttons */}
                      <div className="space-x-3">
                        {(order.status === "DELIVERED" ||
                          order.status === "CANCELED") && (
                          <button className="from-pink-light rounded-lg bg-gradient-to-r to-purple-300 p-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-pink-600 hover:to-purple-400">
                            Buy Again
                          </button>
                        )}

                        {order.status === "SHIPPING" && (
                          <button className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-3 text-sm font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700">
                            Complete Order
                          </button>
                        )}

                        {order.status === "PENDING" && (
                          <button
                            className="rounded-lg border border-red-100 p-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                            onClick={()=>handleCancelOrder(order.id)}
                          >
                            Cancel Order
                          </button>
                        )}

                        {order.status !== "DRAF" && (
                          <Link
                            className="border-primary-dark/10 text-primary-dark hover:bg-primary-dark/10 rounded-lg border p-3 text-sm font-medium transition-colors"
                            to={`${ROUTE_ORDER_DETAILS}/${order.id}`}
                          >
                            View Details
                          </Link>
                        )}

                        {order.status === "DRAF" && (
                          <Link
                            className="border-primary-dark/10 text-primary-dark hover:bg-primary-dark/10 rounded-lg border p-3 text-sm font-medium transition-colors"
                            to={`${ROUTE_CHECKOUT}/${order.id}`}
                          >
                            Continue Order
                          </Link>
                        )}
                      </div>
                      <span className={`flex items-center`}>|</span>
                      <div className="space-y-3">
                        <div className="">
                          <div className="flex items-center gap-2">
                            <span className="text-primary-dark text-sm font-semibold">
                              Order Total:
                            </span>
                            <span className="text-lg font-bold text-red-600">
                              £{order.finalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {props.orderData.data.length === 0 && (
          <div className="rounded-lg bg-white/60 py-16 text-center shadow-sm">
            <div className="mb-4 text-gray-400">
              <Store className="mx-auto h-16 w-16" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No orders found
            </h3>
            <p className="mb-4 text-gray-500">
              You haven't placed any orders yet.
            </p>
            <button className=" rounded-lg bg-gradient-to-r from-pink-light to-purple-300 px-6 py-2 text-white transition-all hover:from-pink-600 hover:to-purple-400">
              Start Shopping
            </button>
          </div>
        )}

        {/* Pagination */}
        {isCanLoadMore() && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => props.loadMore}
              className="text-primary-dark rounded-lg bg-white/80 px-6 py-2 shadow-sm transition-shadow hover:shadow-md"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;