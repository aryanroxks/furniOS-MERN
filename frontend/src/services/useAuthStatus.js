import { useEffect, useState } from "react";
import api from "../services/api.js";

const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      await api.get("/users/current-user");
      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { isLoggedIn, loading, refreshAuth: checkAuth };
};

export default useAuthStatus;
