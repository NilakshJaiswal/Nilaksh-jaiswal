import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { adminApi } from "../lib/api";

interface AdminAuthState {
  email: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthState | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const res = await adminApi.get("/me");
      setEmail(res.data.email);
    } catch {
      setEmail(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = useCallback(async (loginEmail: string, password: string) => {
    const res = await adminApi.post("/login", { email: loginEmail, password });
    setEmail(res.data.email);
  }, []);

  const logout = useCallback(async () => {
    await adminApi.post("/logout");
    setEmail(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ email, loading, login, logout }}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthState {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
