import React, { useEffect, useState } from "react"
import { Navbar as MaterialNavbar, Collapse, IconButton, Dialog, Card, CardBody, Input,  Spinner,  Button, CardHeader, CardFooter, Typography, Menu, MenuHandler, MenuList, MenuItem, Alert, Tooltip } from "@material-tailwind/react"
import { FaBookReader, FaUserCog, FaUserEdit, FaUserLock } from "react-icons/fa"
import { AiOutlineMenu, AiOutlineClose, AiOutlineSearch, AiFillSetting } from "react-icons/ai"
import { BiSolidUser } from "react-icons/bi"
import { TbLogout } from "react-icons/tb"
import { BsCheckCircleFill } from "react-icons/bs"
import { Link } from "react-router-dom"
import api from "../lib/api"
import DialogForm from "./DialogForm"
import Search from "./Search"
import UserSetting from "./UserSetting"

const Navbar = ({ cookie, setCookie}) => {
  const [loading, setLoading] = useState(false)
  const [openNav, setOpenNav] = useState(false)
  const [openSearch, setOpenSearch] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [login, setLogin] = useState(true)
  const [message, setMessage] = useState("")
  const [error, setError] = useState(null)
  const [openSettings, setOpenSettings] = useState(false)


 // handle hiding success messages after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("")
    }, 3000)

    return () => clearTimeout(timer)
  }, [message])


  const handleLogout = async () => {
    setLoading(true)
    try {
      const res = await api.post("auth/user/logout")
      setMessage(res.data)
      setCookie(false)
      localStorage.removeItem("user")
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  // JSX for the navigation menu items
  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-5 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-10">
      <Link to="/">Home</Link>
      <Link className={`${cookie ? "block" : "hidden"}`}>Bookmarks</Link>
      <Link>Comics</Link>
    </ul>
  )

  return (
    <header>
      {message && (
        <Alert color="green" icon={<BsCheckCircleFill />}
          className="rounded-none border-l-4 border-[#2ec946] bg-[#2ec946]/10 font-medium text-[#2ec946]"
        >
          {message}
        </Alert>
      )}
      <DialogForm
        setMessage={setMessage}
        login={login}
        setLogin={setLogin}
        openForm={openForm}
        setOpenForm={setOpenForm}
        setCookie={setCookie}
      />
      <Search openSearch={openSearch} setOpenSearch={setOpenSearch} />
      <div className="container">
        <MaterialNavbar
          shadow={false}
          className="bg-100 z-50 bg-opacity-100 h-max max-w-[1000px] rounded-none py-2 px-4 border-none  lg:py-4"
        >
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
                <span className="text-blue-500 mb-1">
                  <FaBookReader />
                </span>
              </Link>
              <div className="hidden lg:block">{navList}</div>
            </div>
            <div className="flex items-center gap-4">
              <IconButton
                onClick={() => setOpenSearch(true)}
                size="md"
                fullWidth
                className="bg-transparent ml-auto text-lg shadow-none hover:shadow-none"
              >
                <span>
                  <AiOutlineSearch />
                </span>
              </IconButton>
              {cookie ? (
                <>
                  <Menu animate={{ mount: { y: 0 }, unmount: { y: 25 }, }}>
                    <MenuHandler>
                      <IconButton size="md" fullWidth className="bg-50 ml-auto text-md shadow-none hover:shadow-none">
                        <span>
                          <AiFillSetting />
                        </span>
                      </IconButton>
                    </MenuHandler>
                    <MenuList className="bg-blue-gray-900 border-none text-white">
                      <MenuItem onClick={handleLogout} className={`flex items-center gap-4 ${loading && "justify-center"}`}>
                        {loading ? (
                          <Spinner className="h-4 w-4"/>
                        ) :  (
                          <>
                            <span className="text-lg"><TbLogout /></span>
                            Logout
                          </>
                        )}
                      </MenuItem>
                      <MenuItem onClick={() => setOpenSettings(true)} className="flex items-center gap-4">
                        <span className="text-lg"><FaUserCog /></span>
                        Settings
                      </MenuItem>
                    </MenuList>
                  </Menu>
                  <UserSetting openSettings={openSettings} setOpenSettings={setOpenSettings} setMessage={setMessage}/>
                </>
              ) : (
                <IconButton
                  onClick={() => setOpenForm(true)}
                  size="md"
                  fullWidth
                  className="bg-50 ml-auto text-lg shadow-none hover:shadow-none"
                >
                  <span>
                    <BiSolidUser />
                  </span>
                </IconButton>
              )}
            </div>
          </div>
          <Collapse open={openNav}>{navList}</Collapse>
        </MaterialNavbar>
      </div>
    </header>
  )
}

export default Navbar
