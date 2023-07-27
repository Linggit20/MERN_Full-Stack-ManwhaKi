import React from "react"
import Header from "./Header"
import { Outlet } from "react-router-dom"
import Sidenav from "./Sidenav"

const Layout = () => {
  return (
    <div>
      <Header />
      <div className="flex">
        <div className="w-72 hidden lg:block">
          <Sidenav />
        </div>
        <main className="flex-1 p-4 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout