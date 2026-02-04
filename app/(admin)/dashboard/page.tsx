import Link from "next/link";
import DashboardActions from "../components/DashboardActions";

function Page() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here&apos; what&apos;s happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                KSh 145,230
              </h3>
              <p className="text-xs text-green-600 mt-2">
                +12.5% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">342</h3>
              <p className="text-xs text-green-600 mt-2">
                +8.2% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">87</h3>
              <p className="text-xs text-gray-500 mt-2">3 out of stock</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">1,248</h3>
              <p className="text-xs text-green-600 mt-2">
                +15.3% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <DashboardActions />

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <Link
              href={"dashboard/orders"}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-600 pb-3">
                    Order ID
                  </th>
                  <th className="text-left text-xs font-medium text-gray-600 pb-3">
                    Customer
                  </th>
                  <th className="text-left text-xs font-medium text-gray-600 pb-3">
                    Product
                  </th>
                  <th className="text-left text-xs font-medium text-gray-600 pb-3">
                    Amount
                  </th>
                  <th className="text-left text-xs font-medium text-gray-600 pb-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3 text-sm text-gray-900">#ORD-2341</td>
                  <td className="py-3 text-sm text-gray-900">John Kamau</td>
                  <td className="py-3 text-sm text-gray-600">
                    Premium Beef Steak
                  </td>
                  <td className="py-3 text-sm text-gray-900">KSh 2,450</td>
                  <td className="py-3">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      Delivered
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-sm text-gray-900">#ORD-2340</td>
                  <td className="py-3 text-sm text-gray-900">Mary Wanjiru</td>
                  <td className="py-3 text-sm text-gray-600">
                    Chicken Breasts
                  </td>
                  <td className="py-3 text-sm text-gray-900">KSh 1,200</td>
                  <td className="py-3">
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                      Processing
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-sm text-gray-900">#ORD-2339</td>
                  <td className="py-3 text-sm text-gray-900">Peter Ochieng</td>
                  <td className="py-3 text-sm text-gray-600">Lamb Chops</td>
                  <td className="py-3 text-sm text-gray-900">KSh 3,800</td>
                  <td className="py-3">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      Shipped
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-sm text-gray-900">#ORD-2338</td>
                  <td className="py-3 text-sm text-gray-900">Sarah Muthoni</td>
                  <td className="py-3 text-sm text-gray-600">Pork Ribs</td>
                  <td className="py-3 text-sm text-gray-900">KSh 2,100</td>
                  <td className="py-3">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      Delivered
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Selling</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              View all
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Premium Beef Steak
                </p>
                <p className="text-xs text-gray-600">128 sold</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">KSh 2,450</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Chicken Breasts
                </p>
                <p className="text-xs text-gray-600">95 sold</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">KSh 1,200</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Lamb Chops</p>
                <p className="text-xs text-gray-600">82 sold</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">KSh 3,800</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Pork Ribs</p>
                <p className="text-xs text-gray-600">67 sold</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">KSh 2,100</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Ground Beef</p>
                <p className="text-xs text-gray-600">54 sold</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">KSh 890</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
