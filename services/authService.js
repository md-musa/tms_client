import apiClient from "../config/axiosConfig";
import { Alert } from "react-native";

export const registerUser = async (data) => {
  return await apiClient.post("/auth/register", data);
};
export const loginUser = async (data) => {
  return await apiClient.post("/auth/login", data);
};
