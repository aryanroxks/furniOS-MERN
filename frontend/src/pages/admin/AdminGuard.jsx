import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAdminStatus from "../../services/useAdminStatus.js";

const AdminGuard = () => {
  const { isAdmin, loading } = useAdminStatus();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking admin access...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Navigate
        to="/AdminPage"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
};

export default AdminGuard;
