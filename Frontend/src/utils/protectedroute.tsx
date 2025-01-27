import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  if (!accessToken) {
    // Redirect to login if no access token
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
