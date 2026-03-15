import { createContext, ReactNode, useContext, useState } from "react";

type AuthContextValue = {
  isAuthenticated: boolean;
  token: string | null;
  setToken: (value: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const storageKey = "cinemavault-token";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem(storageKey));
  const value: AuthContextValue = {
    isAuthenticated: Boolean(token),
    token,
    setToken: (value) => {
      localStorage.setItem(storageKey, value);
      setTokenState(value);
    },
    logout: () => {
      localStorage.removeItem(storageKey);
      setTokenState(null);
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
