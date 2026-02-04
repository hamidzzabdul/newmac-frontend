"use client";

import { useState } from "react";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="p-6 space-y-6">
      {/* Header Section - Extract to @/components/settings/SettingsHeader.tsx */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your store settings and preferences
        </p>
      </div>

      {/* Tabs Navigation - Extract to @/components/settings/SettingsTabs.tsx */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("general")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === "general"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            General
          </button>

          {/* <button
            onClick={() => setActiveTab("notifications")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === "notifications"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === "security"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            Security
          </button> */}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl">
        {/* General Tab - Extract to @/components/settings/GeneralSettings.tsx */}
        {activeTab === "general" && (
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Information
              </h2>

              {/* Profile Picture */}
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-semibold">JD</span>
                </div>
                <div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer">
                    Change Photo
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG up to 2MB
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="john@newmark.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue="+254 712 345 678"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer shadow-sm">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;
