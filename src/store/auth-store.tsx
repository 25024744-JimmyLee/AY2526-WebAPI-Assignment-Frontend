import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { getCurrentUser } from "../api/auth-api";
import type { AuthUser } from "../types/auth";

type AuthContextValue = {
  isAuthenticated: boolean;
  isRestoringSession: boolean;
  token: string | null;
  user: AuthUser | null;
  setSession: (value: { token: string; user: AuthUser }) => void;
  setUser: (value: AuthUser | null) => void;
  updateUser: (value: Partial<AuthUser>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const storageKey = "cinemavault-token";
const userStorageKey = "cinemavault-user";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const readStoredUser = () => {
    const rawValue = localStorage.getItem(userStorageKey);

    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as AuthUser;
    } catch {
      localStorage.removeItem(userStorageKey);
      return null;
    }
  };

  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem(storageKey));
  const [isRestoringSession, setIsRestoringSession] = useState(() => Boolean(localStorage.getItem(storageKey)));
  const [user, setUserState] = useState<AuthUser | null>(() => readStoredUser());

  useEffect(() => {
    let isCancelled = false;

    async function restoreSession() {
      if (!token) {
        setIsRestoringSession(false);
        return;
      }

      setIsRestoringSession(true);

      try {
        const restoredUser = await getCurrentUser(token);

        if (isCancelled) {
          return;
        }

        localStorage.setItem(userStorageKey, JSON.stringify(restoredUser));
        setUserState(restoredUser);
      } catch {
        if (isCancelled) {
          return;
        }

        localStorage.removeItem(storageKey);
        localStorage.removeItem(userStorageKey);
        setTokenState(null);
        setUserState(null);
      } finally {
        if (!isCancelled) {
          setIsRestoringSession(false);
        }
      }
    }

    void restoreSession();

    return () => {
      isCancelled = true;
    };
  }, [token]);

  const value: AuthContextValue = {
    isAuthenticated: Boolean(token),
    isRestoringSession,
    token,
    user,
    setSession: (value) => {
      localStorage.setItem(storageKey, value.token);
      localStorage.setItem(userStorageKey, JSON.stringify(value.user));
      setTokenState(value.token);
      setUserState(value.user);
    },
    setUser: (value) => {
      if (value) {
        localStorage.setItem(userStorageKey, JSON.stringify(value));
      } else {
        localStorage.removeItem(userStorageKey);
      }

      setUserState(value);
    },
    updateUser: (value) => {
      setUserState((currentUser) => {
        if (!currentUser) {
          return currentUser;
        }

        const nextUser = {
          ...currentUser,
          ...value
        };
        localStorage.setItem(userStorageKey, JSON.stringify(nextUser));
        return nextUser;
      });
    },
    logout: () => {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(userStorageKey);
      setTokenState(null);
      setUserState(null);
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
