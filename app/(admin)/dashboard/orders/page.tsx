function OrdersPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Section - Could be extracted to @/components/orders/OrdersHeader.tsx */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all your customer orders
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Export Orders
        </button>
      </div>

      {/* Stats Overview - Could be extracted to @/components/orders/OrderStats.tsx */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Pending</p>
          <h3 className="text-2xl font-bold text-yellow-600 mt-1">23</h3>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Processing</p>
          <h3 className="text-2xl font-bold text-blue-600 mt-1">45</h3>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Shipped</p>
          <h3 className="text-2xl font-bold text-purple-600 mt-1">67</h3>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Delivered</p>
          <h3 className="text-2xl font-bold text-green-600 mt-1">189</h3>
        </div>
      </div>

      {/* Filters and Search - Could be extracted to @/components/orders/OrderFilters.tsx */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search by order ID, customer name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Date Filter */}
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Orders Table - Could be extracted to @/components/orders/OrdersTable.tsx */}
      {/* Individual rows could be @/components/orders/OrderRow.tsx */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-medium text-gray-600 px-6 py-3">
                  Order ID
                </th>
                <th className="text-left text-xs font-medium text-gray-600 px-6 py-3">
                  Customer
                </th>
                <th className="text-left text-xs font-medium text-gray-600 px-6 py-3">
                  Date
                </th>
                <th className="text-left text-xs font-medium text-gray-600 px-6 py-3">
                  Items
                </th>
                <th className="text-left text-xs font-medium text-gray-600 px-6 py-3">
                  Total
                </th>
                <th className="text-left text-xs font-medium text-gray-600 px-6 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-gray-600 px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Sample Order Row 1 */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  #ORD-2341
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      John Kamau
                    </p>
                    <p className="text-xs text-gray-600">john@example.com</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  Dec 28, 2024
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">3 items</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  KSh 2,450
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    Delivered
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details
                  </button>
                </td>
              </tr>

              {/* Sample Order Row 2 */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  #ORD-2340
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Mary Wanjiru
                    </p>
                    <p className="text-xs text-gray-600">mary@example.com</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  Dec 28, 2024
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">2 items</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  KSh 1,200
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                    Processing
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details
                  </button>
                </td>
              </tr>

              {/* Sample Order Row 3 */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  #ORD-2339
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Peter Ochieng
                    </p>
                    <p className="text-xs text-gray-600">peter@example.com</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  Dec 27, 2024
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">5 items</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  KSh 3,800
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    Shipped
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details
                  </button>
                </td>
              </tr>

              {/* Sample Order Row 4 */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  #ORD-2338
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Sarah Muthoni
                    </p>
                    <p className="text-xs text-gray-600">sarah@example.com</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  Dec 27, 2024
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">1 item</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  KSh 2,100
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    Delivered
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details
                  </button>
                </td>
              </tr>

              {/* Sample Order Row 5 */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  #ORD-2337
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      David Kipchoge
                    </p>
                    <p className="text-xs text-gray-600">david@example.com</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  Dec 26, 2024
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">4 items</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  KSh 4,200
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination - Could be extracted to @/components/shared/Pagination.tsx */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">Showing 1 to 5 of 324 orders</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
