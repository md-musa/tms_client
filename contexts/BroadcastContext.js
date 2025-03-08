import React, { createContext, useState, useContext, useEffect } from "react";
import SecureStorage from "@/utils/asyncStorage";
import { loginUser, registerUser } from "@/services/authService";
import { useRouter } from "expo-router";

const BroadcastContext = createContext();

export const BroadcastProvider = ({ children }) => {
  const [broadcastData, setBroadcastData] = useState({});

  


  return <BroadcastContext.Provider value={{ broadcastData, setBroadcastData }}>{children}</BroadcastContext.Provider>;
};

// Custom Hook to Use Context
export const useBroadcast = () => useContext(BroadcastContext);
