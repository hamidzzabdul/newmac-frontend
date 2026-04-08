const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getAuthToken(): string | null {
  try {
    return localStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

// Types
interface Product {
  _id: string;
  name: string;
  description?: string;
  category: string;
  pricePerKg: number;
  comparePrice?: number;
  sku: string;
  stockkg: number;
  visibility?: string;
  featured?: boolean;
  onSale?: boolean;
  allowBackorder?: boolean;
  images?: string[];
  isAvailable?: boolean;
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

export const getAllProducts = async (): Promise<GetProductsResponse> => {
  let token: string | null = null;

  // ✅ Only access localStorage in browser
  if (typeof window !== "undefined") {
    token = localStorage.getItem("auth_token");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/products`, {
    headers,
  });

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

export const deleteProduct = async (id: string): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete product");
  }

  return response.json();
};
