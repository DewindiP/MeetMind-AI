import { useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../api/auth.api";
import api from "../api/axios";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      const token = localStorage.getItem("meetmind_token");

      if (!token) {
        if (active) setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        if (active) setUser(currentUser);
      } catch {
        localStorage.removeItem("meetmind_token");
        localStorage.removeItem("meetmind_user");

        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    restoreSession();

    const handleUnauthorized = () => {
      localStorage.removeItem("meetmind_token");
      localStorage.removeItem("meetmind_user");
      setUser(null);
    };

    window.addEventListener("meetmind:unauthorized", handleUnauthorized);

    return () => {
      active = false;
      window.removeEventListener(
        "meetmind:unauthorized",
        handleUnauthorized,
      );
    };
  }, []);

  const saveSession = (data) => {
    localStorage.setItem("meetmind_token", data.token);
    localStorage.setItem("meetmind_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    saveSession(data);
    return data.user;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    saveSession(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("meetmind_token");
    localStorage.removeItem("meetmind_user");
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}