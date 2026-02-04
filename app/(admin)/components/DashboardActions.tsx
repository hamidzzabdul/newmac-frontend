import Link from "next/link";

const DashboardActions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Link
        href={"dashboard/products/create"}
        className="bg-white border cursor-pointer border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-sm transition-all text-left"
      >
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <p className="font-medium text-gray-900">Add Product</p>
        <p className="text-xs text-gray-600 mt-1">Create new product listing</p>
      </Link>
      <Link
        href={"dashboard/orders"}
        className="bg-white border cursor-pointer border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-sm transition-all text-left"
      >
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="font-medium text-gray-900">Manage Orders</p>
        <p className="text-xs text-gray-600 mt-1">View and process orders</p>
      </Link>
      <Link
        href={"dashboard/inventory"}
        className="bg-white border cursor-pointer border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-sm transition-all text-left"
      >
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
          <svg
            className="w-5 h-5 text-purple-600"
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
        <p className="font-medium text-gray-900">Inventory</p>
        <p className="text-xs text-gray-600 mt-1">Manage stock levels</p>
      </Link>
      <Link
        href={"dashboard/products/analytics"}
        className="bg-white border cursor-pointer border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-sm transition-all text-left"
      >
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
          <svg
            className="w-5 h-5 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p className="font-medium text-gray-900">Analytics</p>
        <p className="text-xs text-gray-600 mt-1">View detailed reports</p>
      </Link>
    </div>
  );
};

export default DashboardActions;
