import React, { createContext, useState, useContext, useEffect } from "react";
import SecureStorage from "@/utils/asyncStorage";
import { loginUser, registerUser } from "@/services/authService";
import { useRouter } from "expo-router";

const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const [schedules, setSchedules] = useState();

  


  return <ScheduleContext.Provider value={{ schedules, setSchedules }}>{children}</ScheduleContext.Provider>;
};

// Custom Hook to Use Context
export const useSchedule = () => useContext(ScheduleContext);
