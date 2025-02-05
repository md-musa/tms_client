import React, { createContext, useState, useContext } from "react";
import TokenStorage from "@/utils/asyncStorage"
// Create the Context
const AuthContext = createContext();

// Create the Provider Component
export const AuthProvider = ({ children }) => {
  const token = TokenStorage.getToken() || null;

  const [user, setUser] = useState(token);

  const login = (token) => {
    setUser(token);
    console.log("token ====", token);
    TokenStorage.storeToken(token);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Use Context
export const useAuth = () => useContext(AuthContext);
