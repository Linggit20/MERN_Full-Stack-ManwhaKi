import { useEffect, useState } from "react"
import { Card, Typography, List, ListItem, ListItemPrefix, Accordion, AccordionHeader, AccordionBody, } from "@material-tailwind/react"
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { PiBookLight, PiFilesThin } from "react-icons/pi"
import { AiOutlineHome } from "react-icons/ai"
import api from "../../lib/api"
import { useLocation, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { CiLogout } from "react-icons/ci"
import { FaBookReader } from "react-icons/fa"


const Sidenav = ({ onClose }) => {
  const [open, setOpen] = useState(0)
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const navigate = useNavigate()
  const location = useLocation()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const activeHome = location.pathname === "/"
  const activeMangaList = location.pathname === "/manga"
  const activeUploadManga = location.pathname === "/manga/upload"
  const activeUploadChapter = location.pathname === "/manga/chapter/upload"
  const activeAllChapter = location.pathname === "/manga/chapter"

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value)
  }

  const logout = async () => {
    try {
      const res = await api.post("/auth/admin/logout")

      Cookies.remove("auth")
      localStorage.removeItem("currentUser")
      navigate("/login")
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }

  const handleClose = () => {
    if (windowWidth <= 960) {
      onClose()
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <Card shadow={false} className="fixed top-0 left-4 h-screen w-full max-w-[16rem] py-4 lg:pt-20 text-blue-gray-900">
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="mb-2 p-4 lg:hidden">
            <Typography variant="h5" className="flex items-center">
              <FaBookReader className="mr-2 mb-1 text-blue-500"/> ManwhaKi
            </Typography>
          </div>
          <div className="px-2 pb-3 mb-4 border-b">
            <Typography
              variant="small"
              className="mb-1 font-medium"
            >
              User
            </Typography>
            <div className="flex flex-col items-center py-1">
            <Typography
              variant="lead"
              className="mb-1 "
            >
              {currentUser.name}
            </Typography>
            <Typography
              variant="small"
              className="mb-1"
            >
              {currentUser.email}
            </Typography>
            </div>
          </div>
          <div className="mb-2 px-2 border-b">
            <Typography
              variant="small"
              className="mb-1"
            >
              Dashboard
            </Typography>
            <ListItem onClick={() => (navigate("/"), handleOpen(), handleClose())} className={`mb-2 py-4 hover:bg-blue-300 hover:text-white hover:bg-opacity-100 focus:bg-blue-300 focus:bg-opacity-100 focus:text-white active:bg-blue-300 active:bg-opacity-100 active:text-white ${activeHome ? "bg-blue-300 text-white" : ""}`}>
              <ListItemPrefix>
                <AiOutlineHome className="h-5 w-5" />
              </ListItemPrefix>
              <span className="">
                Home
              </span>
            </ListItem>
          </div>
          <List className="border-b">
            <Typography
              variant="small"
              className="mb-1"
            >
              Collections
            </Typography>
            <Accordion
              open={open === 1}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
                />
              }
            >
              <ListItem className="p-0" selected={open === 1}>
                <AccordionHeader onClick={() => handleOpen(1)} className={`border-b-0 p-3 hover:bg-blue-300 hover:text-white ${open === 1 ? "bg-blue-300 text-white" : ""}`}>
                  <ListItemPrefix>
                    <PiBookLight className="h-5 w-5"/>
                  </ListItemPrefix>
                  <Typography className="mr-auto font-normal">
                    Manga
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1">
                <List className="p-0">
                  <ListItem onClick={() => (navigate("/manga"), handleClose())} className={`hover:text-blue-500 hover:bg-white focus:bg-opacity-0 focus:text-blue-500 active:bg-opacity-0 active:text-blue-500 ${activeMangaList ? "text-blue-500" : ""}`}>
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                    </ListItemPrefix>
                    Manga
                  </ListItem>
                  <ListItem onClick={() => (navigate("/manga/upload"), handleClose())} className={`hover:text-blue-500 hover:bg-white focus:bg-opacity-0 focus:text-blue-500 active:bg-opacity-0 active:text-blue-500 ${activeUploadManga ? "text-blue-500" : ""}`}>
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                    </ListItemPrefix>
                    Upload Manga
                  </ListItem>
                </List>
              </AccordionBody>
            </Accordion>
            <Accordion
              open={open === 2}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
                />
              }
            >
              <ListItem className="p-0" selected={open === 2}>
                <AccordionHeader onClick={() => handleOpen(2)} className={`border-b-0 p-3 hover:bg-blue-300 hover:text-white ${open === 2 ? "bg-blue-300 text-white" : ""}`}>
                  <ListItemPrefix>
                    <PiFilesThin className="h-5 w-5" />
                  </ListItemPrefix>
                  <Typography className="mr-auto font-normal">
                    Manga Chapter
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1">
                <List className="p-0">
                  <ListItem onClick={() => (navigate("/manga/chapter"), handleClose())} className={`hover:text-blue-500 hover:bg-white focus:bg-opacity-0 focus:text-blue-500 active:bg-opacity-0 active:text-blue-500 ${activeAllChapter ? "text-blue-500" : ""}`}>
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                    </ListItemPrefix>
                    All Chapter
                  </ListItem>
                  <ListItem onClick={() =>(navigate("/manga/chapter/upload"), handleClose())} className={`hover:text-blue-500 hover:bg-white focus:bg-opacity-0 focus:text-blue-500 active:bg-opacity-0 active:text-blue-500 ${activeUploadChapter ? "text-blue-500" : ""}`}>
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                    </ListItemPrefix>
                    Upload Chapter
                  </ListItem>
                </List>
              </AccordionBody>
            </Accordion>
          </List>
        </div>
        <div>
          <ListItem className="border" onClick={logout}>
            <ListItemPrefix>
              <CiLogout className="h-5 w-5" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </div>
      </div>
    </Card>
  )
}

export default Sidenav