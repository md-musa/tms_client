import SecureStorage from "react-native-secure-storage";

const secureStorageConfig = {
  keychainService: "myKeychain",
  sharedPreferencesName: "mySharedPrefs",
};

SecureStorage.setItem("init", "true", secureStorageConfig).catch((error) => {
  console.error("Error initializing SecureStorage:", error);
});

class TokenStorage {
  static async storeToken(token) {
    try {
      console.log("Storage -----", token);
      await SecureStorage.setItem("token", token);
    } catch (error) {
      console.error("Error storing the token:", error);
    }
  }

  static async getToken() {
    try {
      const token = await SecureStorage.getItem("token");
      return token;
    } catch (error) {
      console.error("Error retrieving the token:", error);
    }
  }

  static async deleteToken() {
    try {
      await SecureStorage.removeItem("token");
    } catch (error) {
      console.error("Error deleting the token:", error);
    }
  }
}

export default TokenStorage;
