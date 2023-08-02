import { Card, CardBody, Dialog, Input, Spinner } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import { Link } from 'react-router-dom'

const Search = ({ openSearch,  setOpenSearch}) => {
  const [manga, setManga] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")


  // debounce the search term for manga search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 900)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])


  // get manga data based on the debounced search term
  useEffect(() => {
    if (debouncedSearchTerm !== "") {
      getManga()
    } else {
      setManga([])
    }
  }, [debouncedSearchTerm])


 // Function to fetch manga data based on the search term
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


  return (
    <Dialog
      size="xs"
      open={openSearch}
      handler={() => setOpenSearch((cur) => !cur)}
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
          <div className="max-h-[250px] overflow-y-scroll px-4 x-scroll">
            {manga
              .filter((item) =>
                item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
              )
              .map((item) => (
                <Link to={`/series/${item.slug}`} key={item._id} onClick={() => setOpenSearch(false)} className="flex gap-2 cursor-pointer group">
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
  )
}

export default Search