import React, { useEffect, useState } from "react";
import { TrendingUp, ShoppingCart, User, Filter, Database } from 'lucide-react';
import AdminContentLayout from "../../../layouts/Admin/ContentLayout.tsx";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StartCard from "./StartCard.tsx";
import { getCurrencySymbol } from "../../../utils/currency.ts";
import useDashboard from "../../../hooks/useDashboard.ts";
import { CustomTooltip } from "../../../components/Chart/CustomTooltip.tsx";
import { E_OrderStatus } from "../../../types/Order.ts";
import { GetProductRequestParam } from "../../../types/Products.ts";
import useProducts from "../../../hooks/useProducts.ts";
import StarRating from "../../../components/StarRating";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [crawlActiveTab, setCrawlActiveTab] = useState('Monthly');

  const  navigate  = useNavigate();

  // Data crawl theo tháng và năm
  const crawlDataMonthly = [
    { period: 'Jan', value: 1200 },
    { period: 'Feb', value: 1800 },
    { period: 'Mar', value: 2400 },
    { period: 'Apr', value: 1900 },
    { period: 'May', value: 2800 },
    { period: 'Jun', value: 3200 },
    { period: 'Jul', value: 2600 },
    { period: 'Aug', value: 3400 },
    { period: 'Sep', value: 2900 },
    { period: 'Oct', value: 3800 },
    { period: 'Nov', value: 3100 },
    { period: 'Dec', value: 4200 }
  ];

  const crawlDataYearly = [
    { period: '2020', value: 18000 },
    { period: '2021', value: 24000 },
    { period: '2022', value: 32000 },
    { period: '2023', value: 28000 },
    { period: '2024', value: 36000 }
  ];

  const currentCrawlData = crawlActiveTab === 'Monthly' ? crawlDataMonthly : crawlDataYearly;
  const maxCrawlValue = Math.max(...currentCrawlData.map(d => d.value));

  // Tạo đường cong mềm với Cubic Bezier
  const createSmoothPath = (points:{x:number, y:number}[]) => {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];

      if (i === 1) {
        // Điểm đầu tiên
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y;
        const cp2x = curr.x - (next ? (next.x - prev.x) * 0.1 : (curr.x - prev.x) * 0.1);
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else if (i === points.length - 1) {
        // Điểm cuối cùng
        const cp1x = prev.x + (curr.x - (points[i-2] ? points[i-2].x : prev.x)) * 0.1;
        const cp1y = prev.y;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else {
        // Các điểm giữa
        const cp1x = prev.x + (curr.x - (points[i-2] ? points[i-2].x : prev.x)) * 0.1;
        const cp1y = prev.y;
        const cp2x = curr.x - (next.x - prev.x) * 0.1;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      }
    }

    return path;
  };

  const periodTypes = ['MONTHLY', 'ANNUALLY'] as const;

  // useFetch data
  const {useFetchMonthlySales, useFetchMonthlyOrders, useFetchNewCustommerCount, useFetchOrderStatusCount, useFetchPeriodicalRevenues, useFetchCrawlDataCount} = useDashboard();
  const {data: monthlyCrawlCount, isLoading:isFetchCrawlDataCountLoading} = useFetchCrawlDataCount;
  const {data: monthlySales, isLoading:isuseFetchMonthlySalesLoading} = useFetchMonthlySales;
  const {data: monthlyOrders, isLoading:isuseFetchMonthlyOrdersLoading} = useFetchMonthlyOrders;
  const {data: newCustomerCount, isLoading:isuseFetchNewCustomerLoading} = useFetchNewCustommerCount;
  const {data: orderStatusCount, isLoading:isuseFetchOrderStatusCountLoading} = useFetchOrderStatusCount;
  const [totalOrderStatusCount, setTotalOrderStatusCount] = useState(0);
  const [periodicalRevenuesType, setPeriodicalRevenuesType] = useState<'ANNUALLY' | 'MONTHLY'>('MONTHLY');
  const {data: periodicalRevenues, isLoading:isuseFetchPeriodicalRevenuesLoading} = useFetchPeriodicalRevenues(periodicalRevenuesType);

  useEffect(() => {
   console.log("monthlyCrawlCount", monthlyCrawlCount);
  }, [monthlyCrawlCount]);
  const {getProducts} = useProducts();
  const bestSellerParams: GetProductRequestParam = {
    page: 0,
    perPage: 10,
    order: "bestSeller:desc"
  };
  const { data:bestSellerData, isLoading:isBestSellerLoading, refetch:bestSellerRefetch } = getProducts(bestSellerParams);
  const bestSellerProducts = bestSellerData?.data ?? [];


  // Xử lý dữ liệu periodicalRevenues để tạo chartData
  const processChartData = () => {
    if (!periodicalRevenues || periodicalRevenues.length === 0) {
      return { chartData: [], chartPoints: [], smoothPath: '', totalRevenue: 0, revenueChange: 0 };
    }

    // Tạo tên tháng từ số
    const getMonthName = (monthNum: number) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[monthNum - 1] || monthNum.toString();
    };

    // Chuyển đổi dữ liệu
    const chartData = periodicalRevenues.map(item => ({
      time: periodicalRevenuesType === 'MONTHLY' ? getMonthName(Number(item.time)) : item.time.toString(),
      value: item.amount,
      originalTime: item.time
    }));

    // Tính toán tổng doanh thu
    const totalRevenue = periodicalRevenues.reduce((sum, item) => sum + item.amount, 0);

    // Tính phần trăm thay đổi (so với kỳ trước)
    let revenueChange = 0;
    if (chartData.length >= 2) {
      const current = chartData[chartData.length - 1].value;
      const previous = chartData[chartData.length - 2].value;
      revenueChange = ((current - previous) / previous * 100);
    }

    // Tìm giá trị max để scale biểu đồ
    const maxValue = Math.max(...chartData.map(d => d.value));
    const minValue = Math.min(...chartData.map(d => d.value));
    const valueRange = maxValue - minValue;

    // Tạo points cho biểu đồ (điều chỉnh để phù hợp với số lượng điểm thực tế)
    const chartPoints = chartData.map((item, index) => ({
      x: 20 + (index * (360 / Math.max(chartData.length - 1, 1))),
      y: valueRange > 0 ? 120 - ((item.value - minValue) / valueRange) * 80 : 60
    }));

    const smoothPath = createSmoothPath(chartPoints);

    return { chartData, chartPoints, smoothPath, totalRevenue, revenueChange };
  };

  const { chartData, totalRevenue, revenueChange } = processChartData();

  useEffect(() => {
    if (orderStatusCount) {
      const total = orderStatusCount.reduce((sum, item) => sum + item.count, 0);
      setTotalOrderStatusCount(total);
    }
  }, [orderStatusCount]);

  useEffect(
    () => {
      console.log("periodicalRevenues",periodicalRevenues);
      // You can add any side effects here if needed
      // For example, useFetching initial data or setting up subscriptions
    },
    [periodicalRevenues] // Empty dependency array means this effect runs once after the initial render
  )

  return (
    <AdminContentLayout>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StartCard title={`Monthly Sales`} isLoading={isuseFetchMonthlySalesLoading} value={`${getCurrencySymbol("GBP")} ${monthlySales?.newSales||0}`} change={`${(monthlySales?.incrementalRate === 100? monthlySales?.incrementalRate: (monthlySales?.incrementalRate ||0).toFixed(2))}%`} changeType={`${monthlySales?.incrementalRate && monthlySales?.incrementalRate>0?"positive":"negative"}`} icon={<TrendingUp />}/>
            <StartCard title={`Monthly Order`} isLoading={isuseFetchMonthlyOrdersLoading} value={`${monthlyOrders?.newOrdersCount||0} order`} change={`${monthlyOrders?.incrementalRate===100?monthlyOrders?.incrementalRate:(monthlyOrders?.incrementalRate||0).toFixed(2)}%`} changeType={`${monthlyOrders?.incrementalRate && monthlyOrders?.incrementalRate>0?"positive":"negative"}`} icon={<ShoppingCart />}/>
            <StartCard title={`New customer`} isLoading={isuseFetchNewCustomerLoading} value={`${(newCustomerCount?.newCustomersCount||0)} Users`} change={`${newCustomerCount?.incrementalRate===100?newCustomerCount?.incrementalRate:(newCustomerCount?.incrementalRate||0).toFixed(2)}%`} changeType={`${newCustomerCount?.incrementalRate && newCustomerCount?.incrementalRate>0?"positive":"negative"}`} icon={<User />}/>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Balance Breakdown - Dynamic Order Status Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Orders</h3>

              {isuseFetchOrderStatusCountLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="text-gray-500">Loading...</div>
                </div>
              ) : orderStatusCount && orderStatusCount.length > 0 ? (
                <>
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        {(() => {
                          // Màu sắc cho từng trạng thái
                          const colors: Record<E_OrderStatus, string>  = {
                            [E_OrderStatus.DELIVERED]: '#10B981',
                            [E_OrderStatus.CANCELED]: '#EF4444',
                            [E_OrderStatus.DRAFT]: '#F59E0B',
                            [E_OrderStatus.CONFIRMED]: '#3B82F6',
                            [E_OrderStatus.PENDING]: '#6B7280',
                            [E_OrderStatus.SHIPPING]: '#F97316'
                          };

                          let currentOffset = 0;

                          return orderStatusCount.map((item) => {
                            const percentage = totalOrderStatusCount > 0 ? (item.count / totalOrderStatusCount) * 100 : 0;
                            const strokeDasharray = `${percentage}, ${100 - percentage}`;
                            const strokeDashoffset = -currentOffset;

                            currentOffset += percentage;

                            return (
                              <path
                                key={item.status}
                                d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={colors[item.status] || '#6B7280'}
                                strokeWidth="3"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                              />
                            );
                          });
                        })()}
                      </svg>

                      {/* Hiển thị tổng số ở giữa */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{totalOrderStatusCount}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {orderStatusCount.map((item) => {
                      // Màu sắc và nhãn cho từng trạng thái
                      const statusConfig = {
                        'DELIVERED': { color: '#10B981', label: 'Delivered', bgColor: 'bg-green-500' },
                        'CANCELED': { color: '#EF4444', label: 'Canceled', bgColor: 'bg-red-500' },
                        'DRAFT': { color: '#F59E0B', label: 'Draft', bgColor: 'bg-yellow-500' },
                        'CONFIRMED': { color: '#3B82F6', label: 'Confirmed', bgColor: 'bg-blue-500' },
                        'PENDING': { color: '#6B7280', label: 'Pending', bgColor: 'bg-gray-500' },
                        'SHIPPING': { color: '#F97316', label: 'Shipping', bgColor: 'bg-orange-500' }
                      };

                      const config = statusConfig[item.status] || {
                        color: '#6B7280',
                        label: item.status,
                        bgColor: 'bg-gray-500'
                      };

                      const percentage = totalOrderStatusCount > 0 ?
                        ((item.count / totalOrderStatusCount) * 100).toFixed(1) : 0;

                      return (
                        <div key={item.status} className="flex items-center gap-3">
                          <div className={`w-3 h-3 ${config.bgColor} rounded-full`}></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500">{config.label}</p>
                            <p className="font-semibold">{item.count} orders</p>
                          </div>
                          <div className="text-sm text-gray-400">
                            {percentage}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-48">
                  <div className="text-gray-500">No order data available</div>
                </div>
              )}
            </div>

            {/* Chart với Recharts - Revenue Report */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Report</h3>
                <div className="flex items-center gap-2">
                  {periodTypes.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setPeriodicalRevenuesType(tab)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        periodicalRevenuesType === tab
                          ? 'bg-pink-light text-white'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab === 'MONTHLY' ? 'Monthly' : 'Yearly'}
                    </button>
                  ))}
                </div>
              </div>

              {isuseFetchPeriodicalRevenuesLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="text-gray-500">Loading revenue data...</div>
                </div>
              ) : chartData.length > 0 ? (
                <>
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {getCurrencySymbol("GBP")}{totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </span>
                      <span className={`text-sm font-medium ${
                        revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}%
                    </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Total {periodicalRevenuesType.toLowerCase()} revenue
                    </p>
                  </div>

                  {/* Recharts AreaChart */}
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#F97316" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="time"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#6B7280' }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#6B7280' }}
                          tickFormatter={(value) => `£${(value / 1000).toFixed(2)}k`}
                        />
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#F97316"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorRevenue)"
                          dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#F97316', strokeWidth: 2, fill: '#FFFFFF' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-48">
                  <div className="text-gray-500">No revenue data available</div>
                </div>
              )}
            </div>
          </div>



          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Biểu đồ cột Data Crawl */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Database className="w-5 h-5 text-pink-light" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Data Crawl Statistics</h3>
                </div>
                <div className="flex items-center gap-2">
                  {['Monthly'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setCrawlActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        crawlActiveTab === tab
                          ? 'text-pink-light '
                          : 'text-gray-500 hover:text-gray-700 bg-gray-100'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center gap-2">
  <span className="text-2xl font-bold text-pink-light">
    {monthlyCrawlCount?.data?.reduce((sum, item) => sum + (item?.count||0), 0).toLocaleString()}
  </span>
                  <span className="text-sm text-gray-500">
    total records {crawlActiveTab.toLowerCase()}
  </span>
                </div>
              </div>

              <div className="h-64 flex items-end justify-center gap-4 px-4">
                {monthlyCrawlCount?.data?.map((item, index) => {
                  const height = (Number(item?.count||0) / maxCrawlValue) * 200;
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-16">
                      <div className="text-xs font-medium text-gray-700 mb-1">
                        {item?.count?.toLocaleString()}
                      </div>
                      <div
                        className="w-full bg-gradient-to-br from-pink-light/50 to-pink-light rounded-t-full transition-all duration-700 hover:from-orange-600 hover:to-orange-500 shadow-sm relative group"
                        style={{ height: `${height}px`, minHeight: '20px' }}
                      >
                        {/* Hiệu ứng shine */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 rounded-t-full transition-opacity duration-300"></div>
                      </div>
                      <div className="text-xs text-gray-500 font-medium mt-1">
                        {item.month}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Popular Products */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Popular Products</h3>
                <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">Filter</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Ratings</th>
                    <th className="pb-3">Sold</th>
                  </tr>
                  </thead>
                  <tbody className="space-y-3">
                  {bestSellerProducts.map((product, index) => (
                    <tr key={index} className="border-t border-gray-100">
                      <td className="py-3" onClick={()=>{navigate(`/products/${product.id}`)}}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <img
                                    src={product.thumbnail || 'https://via.placeholder.com/32'}
                                    alt={product.title}
                                    className=" object-cover "
                                  />
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{product.title}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm font-medium text-gray-900">£{product.price}</td>
                      <td className="py-3 text-sm font-medium text-gray-900"><StarRating rating={product.averageRating || 0} /></td>
                      <td className="py-3 text-sm font-medium text-gray-900">{product.soldQuantity}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminContentLayout>
  );
};

export default Dashboard;