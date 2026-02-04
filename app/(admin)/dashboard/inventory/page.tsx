"use client";

import { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import InventoryTable from "../../components/InventoryTable";
import {
  useDeleteProduct,
  useGetAllProducts,
  useUpdateProductInventory,
} from "@/hooks/useMeatProducts";
import toast from "react-hot-toast";
import { Product } from "@/types/product";
import InventoryStatsCards from "../../components/InventoryStatsCards";
import InventoryForm from "../../components/forms/InventoryForm";
import Link from "next/link";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});

  const { data: products } = useGetAllProducts();
  const updateInventoryMutation = useUpdateProductInventory();
  const DeleteProductMutation = useDeleteProduct();

  const inventory = products?.docs || [];

  const categories = ["All", "Beef", "Chicken", "Pork", "Lamb"];

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === "All" ||
      item.category?.toLowerCase() === filterCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity === 0)
      return { label: "Out of Stock", className: "bg-red-100 text-red-800" };
    if (quantity <= minStock)
      return { label: "Low Stock", className: "bg-yellow-100 text-yellow-800" };
    return { label: "In Stock", className: "bg-green-100 text-green-800" };
  };

  const handleEditClick = (item: Product) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      sku: item.sku,
      category: item.category,
      stockkg: item.stockkg,
      pricePerKg: item.pricePerKg,
    });
    setShowEditModal(true);
  };

  const handleUpdateItem = () => {
    if (!selectedItem?._id) {
      toast.error("No product selected");
      return;
    }

    if (!formData.name || !formData.sku || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    updateInventoryMutation.mutate(
      {
        id: selectedItem._id,
        data: {
          name: formData.name!,
          sku: formData.sku!,
          category: formData.category!,
          stockkg: formData.stockkg || 0,
          pricePerKg: formData.pricePerKg || 0,
        },
      },
      {
        onSuccess: () => {
          toast.success("Inventory updated successfully!");
          setShowEditModal(false);
          setFormData({});
          setSelectedItem(null);
        },
        onError: (error) => {
          toast.error(`Failed to update inventory: ${error.message}`);
        },
      }
    );
  };

  const handleDeleteClick = (id: string) => {
    const product = inventory.find((item) => item._id === id);
    if (product) {
      setProductToDelete(product);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = () => {
    if (!productToDelete?._id) return;
    DeleteProductMutation.mutate(productToDelete._id, {
      onSuccess: () => {
        toast.success("Product deleted successfully!");
        setShowDeleteModal(false);
        setProductToDelete(null);
      },
      onError: (error) => {
        toast.error(`Failed to delete product: ${error.message}`);
      },
    });
  };
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6 space-y-4 w-fit">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Inventory Management
            </h1>
            <p className="text-gray-600">Manage your meat products inventory</p>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
            <svg
              className="w-5 h-5 text-amber-600 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Stock Warning:</span> Items with
              10kg or less are marked as low stock
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <InventoryStatsCards inventory={inventory} />
        {/* Filters and Actions */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Add Product Button */}
            <Link
              href={"/dashboard/products/create"}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Inventory Table */}
        <InventoryTable
          filteredInventory={filteredInventory}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          getStockStatus={getStockStatus}
        />

        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          itemName={productToDelete?.name || ""}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDeleting={DeleteProductMutation.isPending}
        />
        {/* Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div
              className="absolute inset-0 bg-black opacity-70 pointer-events-auto"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                setFormData({}); // Clear form data
                setSelectedItem(null);
              }}
            />
            {/* Modal box */}
            <div className="relative bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto ">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  {showEditModal ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <InventoryForm
                formData={formData}
                setFormData={setFormData}
                onCancel={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                onSubmit={
                  showEditModal
                    ? handleUpdateItem
                    : () => toast.error("Connect add product mutation")
                }
                isEditMode={showEditModal}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
