import { toast } from "sonner";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "error" in data && String(data.error)) ||
      `Request failed (${res.status})`;

    if (res.status === 401) {
      toast.error("Session expired. Please sign in again.");
      if (typeof window !== "undefined") {
        window.location.href = "/login?callbackUrl=" + encodeURIComponent(window.location.pathname);
      }
    } else if (res.status === 403) {
      toast.error("You do not have permission for this action.");
    }

    throw new ApiError(message, res.status);
  }

  return data as T;
}
