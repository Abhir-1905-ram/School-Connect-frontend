"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import * as authApi from "@/lib/api/auth";
import { TOKEN_KEY } from "@/lib/axios";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth-cookies";
import type { User, UserRole } from "@/lib/types";

const USER_KEY = "sc_user";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isAdmin: boolean;
  isPartner: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function persistSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  setAuthCookies(token, user.role);
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  clearAuthCookies();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applyAuth = useCallback((authToken: string, authUser: User) => {
    setToken(authToken);
    setUser(authUser);
    persistSession(authToken, authUser);
  }, []);

  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      setUser(null);
      setToken(null);
      return;
    }

    const me = await authApi.getMe();
    const mergedUser: User = {
      ...me.user,
      partnerId:
        me.user.partnerId ??
        (me.partner as { partnerId?: string } | undefined)?.partnerId,
    };
    setUser(mergedUser);
    setToken(storedToken);
    persistSession(storedToken, mergedUser);
  }, []);

  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      setToken(storedToken);

      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser) as User;
          setUser(parsed);
          setAuthCookies(storedToken, parsed.role);
          setIsLoading(false);
        } catch {
          /* ignore invalid cached user */
        }
      }

      try {
        await refreshUser();
      } catch {
        clearSession();
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    void init();
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      const result = await authApi.login({ email, password });
      const authUser: User = {
        ...result.user,
        partnerId: result.partnerId ?? result.user.partnerId,
      };

      applyAuth(result.token, authUser);

      if (authUser.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/partner/dashboard");
      }

      return authUser;
    },
    [applyAuth, router]
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setToken(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      login,
      logout,
      isAdmin: user?.role === "admin",
      isPartner: user?.role === "partner",
      refreshUser,
    }),
    [user, token, isLoading, login, logout, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
