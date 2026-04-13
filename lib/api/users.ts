const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function getAuthToken(): string | null {
  try {
    return localStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

function getHeaders() {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getAllUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const qs = new URLSearchParams();

  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.search) qs.set("search", params.search);

  const res = await fetch(`${API_BASE_URL}/users?${qs.toString()}`, {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateUserRole(
  userId: string,
  role: "user" | "worker" | "admin",
) {
  const res = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ role }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateMyPassword(payload: {
  passwordCurrent: string;
  password: string;
  passwordConfirm: string;
}) {
  const res = await fetch(`${API_BASE_URL}/users/updateMyPassword`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
