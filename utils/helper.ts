export function parseApiError(
  err: any,
  fallback = "Something went wrong. Please try again.",
): string {
  const responseData = err?.response?.data;

  if (
    responseData &&
    typeof responseData.message === "string" &&
    responseData.message.trim()
  ) {
    return responseData.message;
  }

  if (typeof err?.message === "string" && err.message.trim()) {
    try {
      const parsed = JSON.parse(err.message);
      if (parsed?.message && typeof parsed.message === "string") {
        return parsed.message;
      }
    } catch {
      return err.message;
    }
  }

  const data = responseData || err;

  const code = data?.error?.code ?? data?.error?.errorResponse?.code ?? null;
  const errmsg =
    data?.error?.errorResponse?.errmsg ??
    data?.error?.errmsg ??
    data?.message ??
    "";

  const isDuplicate =
    code === 11000 ||
    String(errmsg).includes("duplicate key") ||
    String(errmsg).includes("11000") ||
    (typeof data?.message === "string" &&
      data.message.toLowerCase().includes("duplicate"));

  if (isDuplicate) {
    return "A user with this email already exists.";
  }

  return fallback;
}
