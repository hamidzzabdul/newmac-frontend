import type { Product, ProductCategory } from "@/types/product";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getAuthToken(): string | null {
  try {
    return localStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

export interface GetProductsResponse {
  docs: Product[];
  result: number;
}
// API Functions
export const createProduct = async (formData: FormData): Promise<Product> => {
  const headers: HeadersInit = {};

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  // Note: No Content-Type here — let browser set it for FormData

  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    console.log(error);
    throw new Error(error.message || "Failed to create product");
  }

  return response.json();
};

export const getAllProducts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}): Promise<GetProductsResponse> => {
  let token: string | null = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("auth_token");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const qs = new URLSearchParams();

  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.search) qs.set("search", params.search);
  if (params?.sort) qs.set("sort", params.sort);

  const url = `${API_BASE_URL}/products${qs.toString() ? `?${qs.toString()}` : ""}`;

  const res = await fetch(url, { headers });

  if (!res.ok) throw new Error("Failed to fetch products");

  return res.json();
};

export const getAllProductsHome = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}): Promise<GetProductsResponse> => {
  let token: string | null = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("auth_token");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const qs = new URLSearchParams();

  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.search) qs.set("search", params.search);
  if (params?.sort) qs.set("sort", params.sort);

  const url = `${API_BASE_URL}/products${qs.toString() ? `?${qs.toString()}` : ""}`;

  const res = await fetch(url, { headers });

  if (!res.ok) throw new Error("Failed to fetch products");

  return res.json();
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
};

export const updateProduct = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}): Promise<Product> => {
  const headers: HeadersInit = {};

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PATCH",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update product");
  }

  return response.json();
};

export const updateProductInventory = async ({
  id,
  data,
}: {
  id: string;
  data: {
    name: string;
    sku: string;
    category: string;
    stockkg: number;
    pricePerKg: number;
  };
}) => {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/products/inventory/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update Inventory");
  }
  return response.json();
};

export const deleteProduct = async (id: string) => {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete product");
  }

  return data;
};
