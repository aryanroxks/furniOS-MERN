import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStatus from "./useAuthStatus.js";

const AuthGuard = () => {
  const { isLoggedIn, loading } = useAuthStatus();
  const location = useLocation();

  if (loading) return null; // or spinner

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
};

export default AuthGuard;
