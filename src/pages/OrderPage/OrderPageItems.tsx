import React from 'react';
import { Store, ShoppingBag, Package, Clock, Truck, CheckCircle, XCircle, RefreshCw} from "lucide-react";
import { Order, OrderStatus } from "../../types/Order.ts";
import { GenericResponseType } from "../../types/common.ts";

interface OrderPageProps {
  orderData?: GenericResponseType<Order>
}

const OrderPage:React.FC<OrderPageProps> = (props) => {

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
            <div key={order.id} className="rounded-lg bg-white/60 shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="bg-pink-light/10 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-primary-dark">
                          Order #{order.id.slice(-8)}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{getStatusText(order.status)}</span>
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{order.orderItems.length} items</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
                  {/* Left Column - Shipping Address & Payment */}
                  <div className="space-y-6 lg:col-span-2">
                    {/* Order Items */}
                    <div className="rounded-lg border border-gray-200 p-4">
                      <h3 className="text-primary-dark flex items-center text-sm font-semibold mb-4">
                        <ShoppingBag className="mr-2 h-4 w-4 text-orange-600" />
                        Order Items
                      </h3>
                      <div className="space-y-4">
                        {order.orderItems.map((orderItem) => (
                          <div key={orderItem.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                            <img
                              src={orderItem?.product?.thumbnail || "/api/placeholder/80/80"}
                              alt={orderItem?.product?.title || "Product"}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="text-primary-dark text-sm font-medium mb-1">
                                {orderItem?.product?.title || "Product"}
                              </h4>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                  Quantity: {orderItem?.quantity}
                                </span>
                                <div className={`flex flex-col items-end `}>
                                  <span className="text-primary-dark text-lg font-bold">
                                    £{orderItem.finalPrice.toFixed(2)}
                                  </span>
                                  <p className="text-sm text-gray-500 mb-3">
                                    £ {(orderItem.finalPrice/orderItem.quantity).toFixed(2)} each
                                  </p>
                                </div>
                              </div>
                              {orderItem.note && (
                                <p className="text-xs text-gray-500 mt-1">
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
                    <div className="rounded-lg flex items-center justify-end gap-3  bg-white/80">
                      {/* Action Buttons */}
                      <div className="space-x-3">
                        {(order.status === 'DELIVERED' || order.status === 'CANCELED') && (
                          <button className="p-3  rounded-lg bg-gradient-to-r from-pink-light shadow-lg  to-purple-300 text-sm font-semibold text-white hover:from-pink-600 hover:to-purple-400 transition-all">
                            Buy Again
                          </button>
                        )}

                        {order.status === 'SHIPPING' && (
                          <button className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-sm font-semibold text-white hover:from-blue-600 hover:to-blue-700 transition-all">
                            Complete Order
                          </button>
                        )}

                        {(order.status === 'DRAF' || order.status === 'PENDING') && (
                          <button className="p-3  rounded-lg border border-red-100 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                            Cancel Order
                          </button>
                        )}

                        <button className="p-3  rounded-lg border border-primary-dark/10 text-sm font-medium text-primary-dark hover:bg-primary-dark/10 transition-colors">
                          View Details
                        </button>

                      </div>
                      <span className={`flex items-center`}>|</span>
                      <div className="space-y-3">
                        <div className="">
                          <div className="flex items-center gap-2">
                            <span className="text-primary-dark text-sm font-semibold">Order Total:</span>
                            <span className="text-lg font-bold text-red-600">£{order.finalAmount.toFixed(2)}</span>
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
          <div className="text-center py-16 bg-white/60 rounded-lg shadow-sm">
            <div className="text-gray-400 mb-4">
              <Store className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <button className="bg-gradient-to-r from-pink-light to-purple-300 text-white px-6 py-2 rounded-lg hover:from-pink-600 hover:to-purple-400 transition-all">
              Start Shopping
            </button>
          </div>
        )}

        {/* Pagination */}
        {isCanLoadMore() && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => console.log('Loading next page...')}
              className="bg-white/80 text-primary-dark px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
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