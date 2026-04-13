"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "./UseAuth";

type UseProtectedPageOptions = {
  redirectTo?: string;
  requireAuth?: boolean;
  allowedRoles?: string[];
  hardRedirect?: boolean;
};

export function useProtectedPage({
  redirectTo = "/",
  requireAuth = true,
  allowedRoles = [],
  hardRedirect = false,
}: UseProtectedPageOptions = {}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const isAuthorized = useMemo(() => {
    if (!requireAuth) return true;
    if (!user) return false;
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return false;
    }
    return true;
  }, [user, requireAuth, allowedRoles]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthorized) {
      const destination = redirectTo || "/";

      if (typeof window !== "undefined") {
        if (hardRedirect) {
          window.location.href = destination;
        } else {
          window.location.replace(destination);
        }
      }
    }
  }, [loading, isAuthorized, redirectTo, hardRedirect, pathname]);

  return {
    user,
    loading,
    isAuthorized,
    isBlocked: !loading && !isAuthorized,
  };
}
