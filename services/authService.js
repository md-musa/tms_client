import apiClient from "../config/axiosConfig";
import { Alert } from "react-native";

export const registerUser = async (data) => {
  try {
    const response = await apiClient.post("/auth/register", data);
    console.log(response);
    Alert.alert("Success", `User Created: ${response.data.name}`);
  } catch (error) {
    console.error("Error:", error);
    Alert.alert("Error", "Failed to create user");
  }
};
export const loginUser = async (data) => {
  try {
    return await apiClient.post("/auth/login", data);
  } catch (error) {
    console.error("Error:", error);
    Alert.alert("Error", "Failed to create user");
  }
};
