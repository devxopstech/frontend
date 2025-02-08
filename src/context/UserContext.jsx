// context/UserContext.jsx
import { createContext, useState, useEffect } from "react";
import { getUserDetails } from "../services/api";
import { toast } from "react-toastify";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(user);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const response = await getUserDetails(token);
          console.log(response);

          if (response.success) {
            setUser({
              ...response.data,
              subscriptionTier: response.data.subscriptionTier || "free",
            });
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("authToken"); // Clear invalid token
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
