import { createContext, useContext, useEffect, useState } from "react";
import { api_url } from "../data/Data"

const getToken = () => localStorage.getItem("access_token");
const storeToken = (token) => localStorage.setItem("access_token", token);
const clearToken = () => localStorage.removeItem("access_token");
const storeUserId = (id) => localStorage.setItem("userId", id);
const clearUserId = () => localStorage.removeItem("userId");

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken);
  const [userId, setUserId] = useState("");
  const [isAdmin, setAdmin] = useState(false);

  const login = (tokenData) => {
    setToken(tokenData.access_token);
    storeToken(tokenData.access_token);
    storeUserId(tokenData.user_id);
    setUserId(tokenData.user_id);
  };

  const logout = () => {
    setToken(null);
    clearToken();
    clearUserId();
    setUserId(null);
  };

  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchPermissions = async () => {
      if (userId) {
        const response = await fetch(`${api_url}/users/${userId}/permissions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const permissions = await response.json();
        const has_access = JSON.parse(JSON.stringify(permissions)).is_admin;
        setAdmin(!!has_access);
      }
    };
    fetchPermissions();
  }, [userId]);

  const contextValue = {
    login,
    token,
    isLoggedIn,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// custom hook
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
