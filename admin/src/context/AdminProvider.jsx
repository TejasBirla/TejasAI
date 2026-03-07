import React, { useState } from "react";
import AdminContext from "./AdminContext";

export default function AdminProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("adminToken") || null,
  );

  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem("adminData");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (newToken, adminData) => {
    setToken(newToken);
    setAdmin(adminData);
    localStorage.setItem("adminToken", newToken);
    localStorage.setItem("adminData", JSON.stringify(adminData));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
  };

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return (
    <AdminContext.Provider
      value={{
        token,
        admin,
        login,
        logout,
        authHeaders,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
