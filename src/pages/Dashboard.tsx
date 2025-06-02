import React, { useState } from 'react';
import { TrendingUp, ShoppingCart, Eye, Filter, Database } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('1W');
  const [crawlActiveTab, setCrawlActiveTab] = useState('Monthly');

  // Sample data
  const statsData = [
    {
      title: 'Total Sales',
      value: '$25,240.00',
      change: '+3.4%',
      changeType: 'positive',
      icon: TrendingUp
    },
    {
      title: 'Total Orders',
      value: '3,469',
      change: '+12.8%',
      changeType: 'positive',
      icon: ShoppingCart
    },
    {
      title: 'Product View',
      value: '680K',
      change: '-2.4%',
      changeType: 'negative',
      icon: Eye
    }
  ];

  const recentOrders = [
    { name: 'iPhone 14 pro', price: '$999', image: '📱' },
    { name: 'iPhone 12 pro', price: '$999', image: '📱' },
    { name: 'Apple Watch SE', price: '$249', image: '⌚' },
    { name: 'iPad mini', price: '$357', image: '📱' }
  ];

  const popularProducts = [
    {
      name: 'iPhone 15 Pro max',
      publishDate: '02 Jan 2023',
      category: 'Gadget',
      brand: 'Apple',
      price: '$1299',
      status: 'In Stock',
      statusType: 'success',
      image: '📱'
    },
    {
      name: 'MacBook Air M1',
      publishDate: '01 Jan 2023',
      category: 'Laptop',
      brand: 'Apple',
      price: '$0299',
      status: 'Out of Stock',
      statusType: 'danger',
      image: '💻'
    },
    {
      name: 'iPhone 15 Pro max',
      publishDate: '02 Jan 2023',
      category: 'Gadget',
      brand: 'Apple',
      price: '$1299',
      status: 'In Stock',
      statusType: 'success',
      image: '📱'
    }
  ];

  const chartData = [
    { time: '10 AM', value: 5000 },
    { time: '1 PM', value: 8000 },
    { time: '4 PM', value: 12000 },
    { time: '7 PM', value: 15000 },
    { time: '10 PM', value: 10000 },
    { time: '1 AM', value: 8000 },
    { time: '4 AM', value: 6000 },
    { time: '7 AM', value: 12000 },
    { time: '10 AM', value: 14000 }
  ];

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

  // Tạo points cho biểu đồ đường
  const chartPoints = chartData.map((item, index) => ({
    x: 20 + (index * 45),
    y: 120 - (item.value / 15000) * 80
  }));

  const smoothPath = createSmoothPath(chartPoints);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">TS</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Welcome Back</p>
              <h1 className="text-xl font-semibold text-gray-900">Tommy Style</h1>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <stat.icon className="w-5 h-5 text-gray-600" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Balance Breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Balance Breakdown</h3>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeDasharray="60, 40"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    strokeDasharray="20, 80"
                    strokeDashoffset="-60"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="3"
                    strokeDasharray="20, 80"
                    strokeDashoffset="-80"
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Net Profit</p>
                  <p className="font-semibold">$32,340</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Expenses</p>
                  <p className="font-semibold">$8,068</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Taxes</p>
                  <p className="font-semibold">$2,560</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart với đường cong mềm */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Report</h3>
              <div className="flex items-center gap-2">
                {['1D', '1W', '1M', '3M', '6M'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">$8,738.05</span>
                <span className="text-green-600 text-sm font-medium">+3.4%</span>
              </div>
            </div>
            <div className="h-48 flex items-end justify-between gap-2">
              <svg className="w-full h-full" viewBox="0 0 400 150">
                {/* Gradient cho area fill */}
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#F97316" stopOpacity="0.05"/>
                  </linearGradient>
                </defs>

                {/* Area fill */}
                <path
                  d={`${smoothPath} L 380 120 L 20 120 Z`}
                  fill="url(#chartGradient)"
                />

                {/* Đường cong mềm */}
                <path
                  d={smoothPath}
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Điểm highlight */}
                {chartPoints.map((point, index) => (
                  <g key={index}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="6"
                      fill="white"
                      stroke="#F97316"
                      strokeWidth="3"
                      className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    />
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="3"
                      fill="#F97316"
                      className="opacity-0 hover:opacity-100 transition-opacity"
                    />
                  </g>
                ))}
              </svg>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {chartData.map((item, index) => (
                <span key={index}>{item.time}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Biểu đồ cột Data Crawl */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Data Crawl Statistics</h3>
            </div>
            <div className="flex items-center gap-2">
              {['Monthly', 'Yearly'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCrawlActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    crawlActiveTab === tab
                      ? 'bg-blue-500 text-white'
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
              <span className="text-2xl font-bold text-blue-600">
                {currentCrawlData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">
                total records {crawlActiveTab.toLowerCase()}
              </span>
            </div>
          </div>

          <div className="h-64 flex items-end justify-center gap-4 px-4">
            {currentCrawlData.map((item, index) => {
              const height = (item.value / maxCrawlValue) * 200;
              return (
                <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-16">
                  <div className="text-xs font-medium text-gray-700 mb-1">
                    {item.value.toLocaleString()}
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-full transition-all duration-700 hover:from-blue-600 hover:to-blue-500 shadow-sm relative group"
                    style={{ height: `${height}px`, minHeight: '20px' }}
                  >
                    {/* Hiệu ứng shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 rounded-t-full transition-opacity duration-300"></div>
                  </div>
                  <div className="text-xs text-gray-500 font-medium mt-1">
                    {item.period}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <button className="text-orange-500 text-sm font-medium hover:text-orange-600">
                See All
              </button>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{order.image}</span>
                    </div>
                    <span className="font-medium text-gray-900">{order.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{order.price}</span>
                </div>
              ))}
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
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Status</th>
                </tr>
                </thead>
                <tbody className="space-y-3">
                {popularProducts.map((product, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm">{product.image}</span>
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-500">{product.category}</td>
                    <td className="py-3 text-sm font-medium text-gray-900">{product.price}</td>
                    <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.statusType === 'success'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {product.status}
                        </span>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;