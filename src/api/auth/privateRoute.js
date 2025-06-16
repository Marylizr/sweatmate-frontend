// privateRoute.js
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";
import LoadingPage from "./loadingPage";

const PrivateRoute = ({ children }) => {
  const { loading, authenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingPage />;
  }

  return authenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
