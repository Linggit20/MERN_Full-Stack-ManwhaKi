import { Navigate, Outlet } from "react-router-dom"
import Cookies from "js-cookie"
import useAuth from "./hooks/useAuth"

const ResetPasswordRoute = () => {
  const resetToken = Cookies.get("resetToken")
  const isAuthenticated = resetToken

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  )
}

const UserSettingsRoute = () => {
  const { state } = useAuth()

  return state.accessToken ? (
    <Outlet /> 
  ) : (
    <Navigate to="/" />
  )
}


export { ResetPasswordRoute, UserSettingsRoute }