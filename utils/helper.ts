export function parseRegisterError(err: any): string {
  const data = err;

  if (!data) return "Registration failed. Please try again.";

  // ── Check for duplicate key in all the places it can hide ──────────────────
  const code = data?.error?.code ?? data?.error?.errorResponse?.code ?? null;

  const errmsg: string =
    data?.error?.errorResponse?.errmsg ??
    data?.error?.errmsg ??
    data?.message ??
    "";

  const isDuplicate =
    code === 11000 ||
    errmsg.includes("duplicate key") ||
    errmsg.includes("11000") ||
    (typeof data?.message === "string" &&
      data.message.toLowerCase().includes("duplicate"));

  if (isDuplicate) return "A user with this email already exists.";

  // ── Fall back to whatever message the server sent ──────────────────────────
  return data?.message ?? "Registration failed. Please try again.";
}

const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};
