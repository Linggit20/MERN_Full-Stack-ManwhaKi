import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const resetToken = Cookies.get("resetToken")
  const isAuthenticated = resetToken

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  )
}


export default ProtectedRoute