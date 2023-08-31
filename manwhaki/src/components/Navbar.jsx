import { useEffect, useState } from "react"
import { Navbar as MaterialNavbar, IconButton, Collapse, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react"
import { Link, useNavigate } from "react-router-dom"
import { FaBookReader, FaUserCog } from "react-icons/fa"
import { AiOutlineMenu, AiOutlineClose, AiOutlineSearch, AiFillSetting } from "react-icons/ai"
import { BiSolidUser } from "react-icons/bi"
import { TbLogout } from "react-icons/tb"
import Cookies from "js-cookie"
import useGlobalError from "../hooks/useGlobalError"
import Search from "./Search"
import useAuth from "../hooks/useAuth"
import useApi from "../hooks/useApi"
import Announcement from "./Announcement"


const Navbar = () => {
  const [openNav, setOpenNav] = useState(false)
  const [openSearch, setOpenSearch] = useState(false)
  const navigate = useNavigate()
  const { state, dispatch } = useAuth()

  const api = useApi()
  const { setGlobalError } = useGlobalError()

  // Add a resize event listener to close the mobile menu on larger screens
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    )
  }, [])

  // Handle user logout
  const handleLogout = async () => {
    setGlobalError(null)

    try {
      const res = await api.post("auth/user/logout")

      Cookies.remove("accessToken")
      localStorage.removeItem("user")
      dispatch({
        type: "LOGOUT",
        payload: {
          accessToken: "",
          user: "",
          message: "Logout successfully"
        }
      })
      
      localStorage.setItem("successMsg", JSON.stringify(res.data))
      navigate("/")
    } catch (err) {
      setGlobalError("Network error occurred. Please try again later")
    }
  }

  // Navigation links list
  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <li>
        <Link onClick={() => setOpenNav(false)} to="/" className="text-gray-300 duration-150 hover:text-white">Home</Link>
      </li>
      <li>
        <Link onClick={() => setOpenNav(false)} to="/bookmarks" className={`text-gray-300 duration-150 hover:text-white ${state.accessToken ? "block" : "hidden"}`}>Bookmarks</Link>
      </li>
    </ul>
  )


  return (
    <header>
      <Announcement />
      <Search openSearch={openSearch} setOpenSearch={setOpenSearch} />
      <MaterialNavbar shadow={false} className="bg-100 mx-auto max-w-[1000px] rounded-none border-none py-2 px-4 lg:py-4 mb-4">
        <div className="container flex items-center justify-between text-blue-gray-900">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4 lg:gap-6">
              <IconButton
                variant="text"
                className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                ripple={true}
                onClick={() => setOpenNav(!openNav)}
              >
                {openNav ? (
                  <span className="text-2xl"><AiOutlineClose /></span>
                ) : (
                  <span className="text-2xl"><AiOutlineMenu /></span>
                )}
              </IconButton>
              <Link to="/" className="flex items-center gap-2 text-4xl">
                <span className="text-blue-500 mb-1"><FaBookReader /></span>
              </Link>
              <div className="hidden lg:block">{navList}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <IconButton
              onClick={() => setOpenSearch(true)}
              className="bg-transparent ml-auto text-lg shadow-none hover:shadow-none"
              size="md"
              fullWidth
            >
              <span>
                <AiOutlineSearch />
              </span>
            </IconButton>
          { state.accessToken ? (
            <Menu animate={{ mount: { y: 0 }, unmount: { y: 25 }, }}>
              <MenuHandler>
                <IconButton size="md" fullWidth className="bg-50 ml-auto text-md shadow-none hover:shadow-none outline-none">
                  <span><AiFillSetting /></span>
                </IconButton>
              </MenuHandler>
              <MenuList className="bg-blue-gray-900 border-none text-white">
                <MenuItem onClick={handleLogout} className={`flex items-center gap-4`}>
                  <span className="text-lg"><TbLogout /></span>
                  Logout
                </MenuItem>
                <MenuItem onClick={() => navigate("/settings")} className="flex items-center gap-4">
                  <span className="text-lg"><FaUserCog /></span>
                  Settings
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <IconButton
              onClick={() => navigate("/login")}
              size="md"
              fullWidth
              className="bg-50 ml-auto text-lg shadow-none hover:shadow-none"
            >
              <span>
                <BiSolidUser />
              </span>
            </IconButton>
          ) }
          </div>
        </div>
        <Collapse open={openNav}>
          <div className="container mx-auto">
            {navList}
          </div>
        </Collapse>
      </MaterialNavbar>
    </header>
  )
}

export default Navbar