import { useEffect, useState } from "react"
import { Navbar, Typography, Drawer, IconButton, Input, Button, MenuHandler, MenuList, MenuItem, Menu, } from "@material-tailwind/react"
import { Cog6ToothIcon } from "@heroicons/react/24/solid"
import Sidenav from "./Sidenav"
import { FaBookReader } from "react-icons/fa";

const Header = () => {
  const [openNav, setOpenNav] = useState(false)
  const [open, setOpen] = useState(false)


  const closeDrawer = () => setOpen(false)
  
  const toggleDrawer = () => setOpen(prevState => prevState === false ? true : false)

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    )
  }, [])

  return (
    <header>
      <Drawer overlay={false} open={open} onClose={closeDrawer} className="p-4">
        <Sidenav onClose={closeDrawer}/>
      </Drawer>
      <Navbar className="fixed top-0 z-50 bg-opacity-100 h-max max-w-full rounded-none py-3 px-4 lg:px-8">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography className="mr-4 py-1.5 font-bold text-2xl flex items-center">
            <FaBookReader className="mr-2 mb-1 text-blue-500"/> ManwhaKi
          </Typography>
          <div className="flex items-center gap-4">
            <div className="ml-auto flex gap-1 md:mr-3">
              <Menu>
                <MenuHandler>
                  <IconButton variant="text" color="blue-gray">
                    <Cog6ToothIcon className="h-4 w-4" />
                  </IconButton>
                </MenuHandler>
                <MenuList>
                  <MenuItem className="text-center">Settings</MenuItem>
                </MenuList>
              </Menu>
            </div>
            <div className="hidden lg:block">
              <div className="relative flex w-full gap-2 md:w-max">
                <Input
                  type="search"
                  label="Search Manga"
                  className="pr-20"
                  containerProps={{
                    className: "min-w-[288px]",
                  }}
                />
                <Button size="sm" className="!absolute right-1 top-1 rounded">
                  Search
                </Button>
              </div>
            </div>
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={toggleDrawer}
            >
              {open? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
          </div>
        </div>
      </Navbar>
    </header>
  )
}

export default Header