import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContexts } from "../authProvider/AuthProvider";
import LoadingSpinner from "../pages/shared/LoadingSpinner";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContexts);
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
