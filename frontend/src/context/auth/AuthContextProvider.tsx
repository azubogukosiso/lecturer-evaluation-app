import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { apiFetch } from "../../services/api";

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<{
    id: string;
    emailAddress: string;
    role: string;
  } | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await apiFetch("/api/auth/checkAuth");

      if (data) {
        setUser(data);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    } finally {
      setLoadingUser(false);
    }
  };

  const logout = async () => {
    try {
      await apiFetch("/api/auth/logout", {
        method: "POST",
      });
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const contextValue = {
    user,
    setUser,
    loadingUser,
    setLoadingUser,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
