import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "./hooks/useAuth";

const ProtectedRoute = () => {
  const { auth } = useAuth()

  return auth.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  )
}


const ProtectedRouteResetPass = () => {
  const resetPassword = Cookies.get("resetPassword");
  const isAuthenticated = resetPassword

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};


export {ProtectedRoute, ProtectedRouteResetPass}