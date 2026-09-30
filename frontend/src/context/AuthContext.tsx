import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
} from "../services/auth";

import type {
  User,
} from "../types/auth";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | null>(
    null
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function refreshUser() {
    const token =
      localStorage.getItem(
        "access_token"
      );

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const currentUser =
        await getCurrentUser();

      setUser(currentUser);

    } catch {
      localStorage.removeItem(
        "access_token"
      );

      setUser(null);
    }
  }

  function logout() {
    toast.success("logout successfully!.")
    localStorage.removeItem(
      "access_token"
    );

    setUser(null);
  }

  useEffect(() => {
    async function loadUser() {
      await refreshUser();
      setLoading(false);
    }

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}