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
        const auth = await SecureStorage.getItem("auth-1");
        const route = await SecureStorage.getItem("route");
        if (auth && route) {
          console.log("Fetched from storage:", auth, route);
          setUserData({ ...JSON.parse(auth), route: JSON.parse(route) });

          router.push("/home");
        }
      } catch (err) {
        console.error("Error retrieving auth data:", err);
      }
    };

    loadUserData();
  }, []);

  const updateRoute = async (routeData) => {
    console.log("Route data------------\n", routeData);
    try {
      await SecureStorage.setItem("route", JSON.stringify(routeData));
      setUserData({ ...userData, route: routeData });
    } catch (err) {
      console.error("Update Route Error:", err);
    }
  };

  const registration = async (data) => {
    try {
      const result = await registerUser(data);
      console.log("Registration Success:", result);

      const { accessToken, user } = result.data.data;
      const { name, email, role, routeId } = user;

      await SecureStorage.setItem("auth-1", JSON.stringify({ accessToken, name, email, role }));
      await SecureStorage.setItem("route", JSON.stringify({ route: routeId }));

      setUserData({ accessToken, name, email, role, route: routeId });
      router.push("/home");
    } catch (err) {
      console.error("Registration Error:", err);
    }
  };

  const login = async (data) => {
    try {
      const result = await loginUser(data);
      console.log("Login Success:", result);

      const { accessToken, user } = result.data.data;
      const { name, email, role, routeId } = user;

      await SecureStorage.setItem("auth-1", JSON.stringify({ accessToken, name, email, role }));
      await SecureStorage.setItem("route", JSON.stringify({ route: routeId }));

      setUserData({ accessToken, name, email, role, route: routeId });
      router.push("/home");
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  const logout = async () => {
    try {
      await SecureStorage.removeItem("auth-1");
      await SecureStorage.removeItem("route");
      setUserData(null);
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ userData, login, registration, logout, updateRoute }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Use Context
export const useAuth = () => useContext(AuthContext);
