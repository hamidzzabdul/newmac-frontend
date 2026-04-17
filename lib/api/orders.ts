const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function to254(phone: string) {
  const p = phone.replace(/\s+/g, "").replace("+", "");
  if (p.startsWith("254")) return p;
  if (p.startsWith("0")) return "254" + p.slice(1);
  return p; // last resort
}

function getAuthToken(): string | null {
  try {
    return localStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

export const createOrder = async (payload: any) => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const startMpesaStkPush = async (orderId: string, phone: string) => {
  const token = getAuthToken();

  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/mpesa/stkpush`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ phone }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export async function getOrder(orderId: string) {
  const token = getAuthToken();

  const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getMyOrders() {
  const token = getAuthToken();

  const res = await fetch(`${API_BASE_URL}/orders/my-orders`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getAdminOrders() {
  const token = getAuthToken();

  const res = await fetch(`${API_BASE_URL}/orders/admin/all`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getOrderById(orderId: string) {
  const token = getAuthToken();

  const res = await fetch(`${API_BASE_URL}/orders/admin/${orderId}`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateOrderStatus(orderId: string, status: string) {
  const token = getAuthToken();

  const res = await fetch(`${API_BASE_URL}/orders/admin/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Paystack integration
export async function initializePaystackPayment(orderId: string) {
  const token = getAuthToken();
  const res = await fetch(
    `${API_BASE_URL}/orders/${orderId}/paystack/initialize`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function downloadReceipt(orderId: string): Promise<Blob> {
  const token = getAuthToken();

  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/receipt`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) throw new Error(await res.text());
  return res.blob();
}
