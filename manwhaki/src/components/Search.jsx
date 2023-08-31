import { useEffect, useState } from "react"
import { Card, CardBody, Dialog, Input, Spinner, Typography } from "@material-tailwind/react"
import { Link } from "react-router-dom"
import api from "../lib/api"

// eslint-disable-next-line react/prop-types, no-unused-vars
const Search = ({ openSearch, setOpenSearch }) => {
  const [manga, setManga] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")


  // Reset search term when search dialog is opened or closed
  useEffect(() => {
    if (!openSearch) {
      setSearchTerm("")
    }
  }, [openSearch])

  // Debounce the search term for smoother searching experience
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 900)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  // Fetch manga data based on the debounced search term
  useEffect(() => {
    if (debouncedSearchTerm !== "") {
      getManga()
    } else {
      setManga([])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm])

  // Fetch manga data from the API
  const getManga = async () => {
    setLoading(true)
    
    try {
      const res = await api.get("/manga")
      setLoading(false)
      setManga(res.data.mangaList)
    } catch (err) {
      setOpenSearch(false)
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  // Filter manga list based on the search term
  const filterMangaBySearchTerm = (mangaList, searchTerm) => {
    return mangaList.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Create a filtered manga list based on the search term
  const filteredManga = filterMangaBySearchTerm(manga, debouncedSearchTerm)

  return (
    <Dialog
      open={openSearch}
      handler={() => setOpenSearch((cur) => !cur)}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full max-w-[24rem] bg-50">
        <CardBody className="flex flex-col gap-4">
          <Input
            className="text-gray-200"
            label="Search"
            variant="standard"
            size="lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardBody>
        { loading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner />
          </div>
        ) : (
          <div className="max-h-[250px] overflow-y-scroll px-4 scroll">
            {filteredManga.map(item => (
              <Link
                to={`/series/${item.slug}`}
                key={item._id}
                onClick={() => setOpenSearch(false)}
                className="flex gap-2 cursor-pointer group"
              >
                <img
                  src={item.coverURL}
                  alt={item.title}
                  className="w-16 h-20 mb-4 rounded-md"
                  loading="lazy"
                />
                <span className="text-gray-200 text-sm duration-150 group-hover:text-blue-500">
                  {item.title}
                </span>
              </Link>
            ))}
            {filteredManga.length === 0 && debouncedSearchTerm && (
              <Typography className="text-center mb-4 text-gray-200 text-sm">No manga found.</Typography>
            )}
          </div>
        )}
      </Card>
    </Dialog>
  )
}

export default Search
