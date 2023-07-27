import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const accessToken = Cookies.get("auth")
  const isAuthenticated = accessToken

  return isAuthenticated ? (
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