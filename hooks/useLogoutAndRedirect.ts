"use client";

import { useCallback } from "react";
import { useAuth } from "@/hooks/UseAuth";

type UseLogoutAndRedirectOptions = {
  redirectTo?: string;
  clearSessionKeys?: string[];
  message?: string;
};

export function useLogoutAndRedirect({
  redirectTo = "/",
  clearSessionKeys = ["auth_token", "user"],
  message = "Signing you out...",
}: UseLogoutAndRedirectOptions = {}) {
  const { logout } = useAuth();

  const logoutAndRedirect = useCallback(() => {
    if (typeof document !== "undefined") {
      const existing = document.getElementById("logout-overlay");
      if (!existing) {
        const overlay = document.createElement("div");
        overlay.id = "logout-overlay";
        overlay.innerHTML = `
          <div class="logout-overlay-backdrop"></div>
          <div class="logout-overlay-card">
            <div class="logout-overlay-spinner"></div>
            <p class="logout-overlay-text">${message}</p>
          </div>
        `;
        document.body.appendChild(overlay);
      }
      document.body.classList.add("logging-out");
    }

    try {
      clearSessionKeys.forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
    } catch {}

    logout?.();

    window.setTimeout(() => {
      if (typeof window !== "undefined") {
        window.location.href = redirectTo;
      }
    }, 220);
  }, [logout, redirectTo, clearSessionKeys, message]);

  return { logoutAndRedirect };
}
