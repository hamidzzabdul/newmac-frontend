"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthUser {
  fullName: string;
  email: string;
  token?: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isSignedIn: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("auth_user");

      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to parse user:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (u: AuthUser) => {
    setUser(u);

    localStorage.setItem("auth_user", JSON.stringify(u));

    if (u.token) {
      localStorage.setItem("auth_token", u.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  const isSignedIn = !!user;
  const isAdmin = user?.role === "admin";
  return (
    <AuthContext.Provider
      value={{
        user,
        isSignedIn,
        isAdmin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
