import { useEffect, useState } from "react";
import api from "../services/api.js";
import { roles } from "./constants.js";

const useAdminStatus = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdmin = async () => {
    try {
      const res = await api.get("/users/current-user");
      const user = res.data?.data;

      if (user?.roleID?.toString() === roles.admin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  return { isAdmin, loading, refreshAdmin: checkAdmin };
};

export default useAdminStatus;
