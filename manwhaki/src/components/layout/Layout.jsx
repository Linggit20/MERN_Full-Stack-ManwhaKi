import { Outlet } from "react-router-dom"
import Navbar from "../Navbar"
import SuccessMessage from "../SuccessMessage"
import GlobalError from "../error/GlobalError"

const Layout = () => {
  return (
    <>
      <SuccessMessage />
      <GlobalError />
      <Navbar />
      <Outlet />
    </>
  )
}

export default Layout