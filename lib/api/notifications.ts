const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function getAuthToken(): string | null {
  try {
    return localStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

export async function getAdminNotifications(limit = 8, type = "all") {
  const token = getAuthToken();

  const res = await fetch(
    `${API_BASE_URL}/notifications/admin/notifications?limit=${limit}&type=${type}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch notifications");
  }

  return data;
}
