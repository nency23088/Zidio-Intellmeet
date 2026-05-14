import type { AxiosError } from "axios";

type ApiErrorBody = {
  message?: string;
  errors?: Array<{ path?: string; msg?: string; message?: string }>;
};

/**
 * Pulls a user-facing message from an axios/fetch error response.
 */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  const err = error as AxiosError<ApiErrorBody>;
  const data = err.response?.data;

  if (data?.message && typeof data.message === "string") {
    return data.message;
  }

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors
      .map((e) => (e as { msg?: string; message?: string }).msg || (e as { message?: string }).message || "")
      .filter(Boolean)
      .join("; ");
  }

  if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
    return "Cannot reach the server. Check that the API is running and VITE_API_URL matches the page origin (localhost vs 127.0.0.1).";
  }

  return fallback;
}
