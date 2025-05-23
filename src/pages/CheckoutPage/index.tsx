import React, { useEffect, useRef, useState } from "react";
import { MapPin, CreditCard, ShoppingBag, Tag, Plus, Check, ArrowLeft } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import useOrders, { ReqModifyOrder } from "../../hooks/useOrder.ts";
import { Order, ResGetOrderById } from "../../types/Order.ts";
import ShippingAddress from "../../components/Modal/ShippingAddress.tsx";
import Modal from "../../components/Modal";

const CheckoutPage = () => {

  const { orderId } = useParams<{ orderId: string }>();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const location = useLocation();
  const hasRequestedOrder = useRef(false);

  const {getOrder, isLoading, onRequestUpdateOrder } = useOrders();
  const [order, setOrder] = useState<ResGetOrderById | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRequestingOrder, setIsRequestingOrder] = useState(false);

  const {data, refetch: refreshOrder} = getOrder(orderId||"");

  useEffect(() => {
    if (data) {
      setOrder(data);
    }
  }, [data]);

  // Use real data from order API with safe access
  const subtotal = order?.totalAmount || 0;
  const shippingFee = order?.shippingFee||0;
  const discount = order?.totalDiscount || 0;
  const total = order?.finalAmount || 0;

  const handleChangeOrderAddress = (addressId: string) => {
    console.log("Address changed to:", addressId);

    const modifyData = {
      orderId: orderId,
      modifyData:{
        shippingAddressId:addressId,
      }
    } as ReqModifyOrder;

    onRequestUpdateOrder(
      modifyData,
      ()=>{
        console.log("Address updated successfully");
        setShowAddressForm(false);
        setIsRequestingOrder(false);
        refreshOrder();
      },
      (error) => {
        console.error("Error updating address:", error);
        setError("Failed to update address");
        setIsRequestingOrder(false);
      }
    )
  }

  const handleApplyCoupon = () => {
    // This functionality might be moved to server-side in the future
    // For now, coupon handling should be done when creating the order
    console.log("Coupon functionality should be handled server-side");
  };

  const handleRemoveCoupon = () => {
    // This functionality might be moved to server-side in the future
    console.log("Coupon removal should be handled server-side");
  };


  // Show error state
  if (error) {
    return (
      <div className="bg-primary min-h-screen flex items-center justify-center">
        <div className="text-center bg-white/80 p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              console.log("🔄 Retry button clicked");
              setError(null);
              setIsRequestingOrder(false);
              hasRequestedOrder.current = false;
              window.location.reload();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Show loading state while fetching order data
  if (isLoading || isRequestingOrder) {
    return (
      <div className="bg-primary min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  // Show message if no order data
  if (!order) {
    return (
      <div className="bg-primary min-h-screen flex items-center justify-center">
        <div className="text-center bg-white/80 p-8 rounded-lg shadow-md max-w-md">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thông tin đơn hàng</h3>
          <p className="text-gray-600 mb-4">Vui lòng thử lại sau</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" py-4 bg-primary min-h-screen">
      {showAddressForm && (
        <Modal>
          <div className={`w-1/2 h-2/3 overflow-y-auto`}>
            <ShippingAddress
              defaultAddress={data?.shippingAddress}
              onChangeOrderAddress={handleChangeOrderAddress}
              isChangeOrderAddressLoading={isLoading}/>
          </div>
        </Modal>
      )}

      <div className="mx-auto max-w-7xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-primary-dark hover:text-primary-dark">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </button>
          </div>
          <div className="w-24"></div>
        </div>
        <h1 className="text-xl mb-4 font-bold text-primary-dark">Your Shopping Basket</h1>


        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Address & Payment */}
          <div className="space-y-6 lg:col-span-2">
            {/* Delivery Address Section */}
            <div className="rounded-lg bg-white/80 p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-primary-dark flex items-center text-lg font-semibold">
                  <MapPin className="text-pink-light mr-2 h-5 w-5" />
                  Delivery Address
                </h2>
              </div>

              <div className="flex items-center">
                <div className={`grow-1 border-l-3 border-primary-dark/50 p-4 transition-colors`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center">
                        <span className="text-gray-500">{order.shippingAddress?.title}</span>
                        <span className="text-gray-500 mx-2">|</span>
                        <span className="text-gray-500">{order.shippingAddress?.phone}</span>
                        {order.shippingAddress?.isDefault && (
                          <span className="ml-2 rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress?.address || ""},{" "}
                        {order.shippingAddress?.district || ""},{" "}
                        {order.shippingAddress?.city || ""},{" "}
                        {order.shippingAddress?.country || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  className={`pl-4 text-pink-light hover hover:drop-shadow-lg cursor-pointer`}
                  onClick={()=>setShowAddressForm(true)}
                >
                  Change
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-lg bg-white/80 p-6 shadow-sm">
              <h2 className="text-primary-dark mb-4 flex items-center text-lg font-semibold">
                <CreditCard className="mr-2 h-5 w-5 text-purple-600" />
                Payment Method
              </h2>

              <div className="space-y-3">
                <div className="rounded-lg border border-blue-500 bg-blue-50 p-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      defaultChecked
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-primary-dark ml-3 font-medium">
                      Pay on delivery (COD)
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-primary-dark ml-3 font-medium">
                      Credit/Debit Card
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg bg-white/80 p-6 shadow-sm">
              <h2 className="text-primary-dark mb-4 flex items-center text-lg font-semibold">
                <ShoppingBag className="mr-2 h-5 w-5 text-orange-600" />
                Order Summary
              </h2>

              {/* Cart Items - Use real data from order with safe access */}
              <div className="mb-6 space-y-4">
                {order.orderItems?.map((orderItem) => (
                  <div key={orderItem.id} className="flex items-start space-x-3">
                    <img
                      src={orderItem?.product?.thumbnail || "/api/placeholder/80/80"}
                      alt={orderItem?.product?.title || "Product"}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-primary-dark truncate text-sm font-medium">
                        {orderItem?.product?.title || "Product"}
                      </h3>
                      {/*<p className="text-xs text-gray-500">*/}
                      {/*  {orderItem?.product?.description || ""}*/}
                      {/*</p>*/}
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          x{orderItem?.quantity}
                        </span>
                        <span className="text-primary-dark text-sm font-medium">
                          £{orderItem.finalPrice}
                        </span>
                      </div>
                      {orderItem.note && (
                        <p className="text-xs text-gray-500 mt-1">
                          Ghi chú: {orderItem.note}
                        </p>
                      )}
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-gray-500 py-4">
                    Không có sản phẩm nào
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SubTotal:</span>
                  <span className="text-primary-dark">
                    £{subtotal}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping fee:</span>
                  <span className="text-primary-dark">
                    £{shippingFee}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-green-600">
                      -£{discount}
                    </span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-primary-dark text-lg font-semibold">
                      Total
                    </span>
                    <span className="text-lg font-bold text-red-600">
                      £{total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="mt-6 w-full transform rounded-lg bg-gradient-to-r from-pink-light to-purple-300 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-purple-700">
                Confirm Order
              </button>

              {/* Security Note */}
              <p className="mt-4 text-center text-xs text-gray-500">
                By placing an order, you agree to our{" "}


                <span className="cursor-pointer text-blue-600 hover:underline">
                  Terms of Service
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;