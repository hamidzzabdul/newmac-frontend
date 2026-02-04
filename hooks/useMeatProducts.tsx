import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  GetProductsResponse,
  updateProduct,
  updateProductInventory,
} from "@/lib/api/products";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Custom Hooks
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      console.error("Create product error:", error);
    },
  });
};

export const useGetAllProducts = () => {
  return useQuery<GetProductsResponse>({
    queryKey: ["products"],
    queryFn: getAllProducts, // ✅ now TS knows this returns Product[]
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetProductById = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", data._id] });
    },
    onError: (error: Error) => {
      console.error("Update product error:", error);
    },
  });
};

export const useUpdateProductInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProductInventory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", data.data._id] });
    },
    onError: (error: Error) => {
      console.error("Update inventory error:", error);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      console.error("Delete product error:", error);
    },
  });
};
