import React, { createContext, useState, useContext, useEffect } from "react";
import SecureStorage from "@/utils/asyncStorage";
import { loginUser, registerUser } from "@/services/authService";
import { useRouter } from "expo-router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await SecureStorage.getItem("auth");
        if (data) {
          console.log("Fetched from storage:", data);
          setUserData(JSON.parse(data));

          router.push("/home");
        }
      } catch (err) {
        console.error("Error retrieving auth data:", err);
      }
    };

    loadUserData();
  }, []);

  const registration = async (data) => {
    try {
      const result = await registerUser(data);
      console.log("Registration Success:", result);
      await SecureStorage.setItem("auth", JSON.stringify(result.data.data));
      setUserData(result.data.data);
      router.push("/home");
    } catch (err) {
      console.error("Registration Error:", err);
    }
  };

  const login = async (data) => {
    try {
      const result = await loginUser(data);
      console.log("Login Success:", result);
      await SecureStorage.setItem("auth", JSON.stringify(result.data.data));
      setUserData(result.data.data);
      router.push("/home");
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  const logout = async () => {
    try {
      await SecureStorage.removeItem("auth"); // Correct method name
      setUserData(null);
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  return <AuthContext.Provider value={{ userData, login, registration, logout }}>{children}</AuthContext.Provider>;
};

// Custom Hook to Use Context
export const useAuth = () => useContext(AuthContext);
