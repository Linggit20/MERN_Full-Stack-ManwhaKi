import React, { useEffect, useState } from "react"
import {
  Navbar as MaterialNavbar,
  Collapse,
  IconButton,
  Dialog,
  Card,
  CardBody,
  Input,
  Spinner,
} from "@material-tailwind/react"
import { FaBookReader } from "react-icons/fa"
import { AiOutlineSearch } from "react-icons/ai"
import { BiSolidUser } from "react-icons/bi"
import { Link } from "react-router-dom"
import api from "../lib/api"

const Navbar = () => {
  const [manga, setManga] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  const [openNav, setOpenNav] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 900)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  useEffect(() => {
    if (debouncedSearchTerm !== "") {
      getManga()
    } else {
      setManga([])
    }
  }, [debouncedSearchTerm])

  const getManga = async () => {
    setLoading(true)
    try {
      const res = await api.get("/manga")
      setLoading(false)
      setManga(res.data.mangaList)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const handleSlug = (mangaSlug, chapterSlug) => {
    const storedSlugs = JSON.parse(localStorage.getItem("selectedSlugs")) || {}
    storedSlugs[mangaSlug] = chapterSlug
    localStorage.setItem("selectedSlugs", JSON.stringify(storedSlugs))
  }

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-10">
      <Link to="/bookmarks">Bookmarks</Link>
      <Link to="/comics">Comics</Link>
    </ul>
  )

  return (
    <header>
      <Dialog
        size="xs"
        open={openDialog}
        handler={() => setOpenDialog((cur) => !cur)}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem] bg-50">
          <CardBody className="flex flex-col gap-4">
            <Input
              label="Search"
              variant="standard"
              size="lg"
              className="text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardBody>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          ) : (
            <div className="max-h-[250px] overflow-y-scroll px-4">
              {manga
                .filter((item) =>
                  item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                )
                .map((item) => (
                  <Link to={`/series/${item.slug}`} key={item._id} onClick={() => (handleSlug("mangaSlug", item.slug), setOpenDialog(false))} className="flex gap-2 cursor-pointer group">
                    <img src={item.coverURL} alt={item.title} className="w-16 h-20 mb-4 rounded-md" />
                    <span className="text-white text-sm duration-150 group-hover:text-blue-500">{item.title}</span>
                  </Link>
                ))}
              {manga && manga.length > 0 && debouncedSearchTerm && manga.filter((item) =>
                item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
              ).length === 0 && (
                <p className="text-center mb-4 text-white text-sm">No manga found.</p>
              )}
            </div>
          )}
        </Card>
      </Dialog>
      <div className="container">
        <MaterialNavbar
          shadow={false}
          className="bg-100 z-50 bg-opacity-100 h-max max-w-[1000px] rounded-none py-2 px-4 border-none  lg:py-4"
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <IconButton
                variant="text"
                className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                ripple={true}
                onClick={() => setOpenNav(!openNav)}
              >
                {openNav ? (
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
              <Link to="/" className="flex items-center gap-2 text-4xl">
                <span className="text-blue-500 mb-1">
                  <FaBookReader />
                </span>
              </Link>
              <div className="hidden lg:block">{navList}</div>
            </div>
            <div className="flex items-center gap-4">
              <IconButton
                onClick={() => setOpenDialog(true)}
                size="md"
                fullWidth
                className="bg-transparent ml-auto text-lg shadow-none hover:shadow-none"
              >
                <span>
                  <AiOutlineSearch />
                </span>
              </IconButton>
              <IconButton
                size="md"
                fullWidth
                className="bg-50 ml-auto text-lg shadow-none hover:shadow-none"
              >
                <span>
                  <BiSolidUser />
                </span>
              </IconButton>
            </div>
          </div>
          <Collapse open={openNav}>{navList}</Collapse>
        </MaterialNavbar>
      </div>
    </header>
  )
}

export default Navbar
