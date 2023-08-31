/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Typography, Card, CardBody, Spinner, Button, Dialog, DialogHeader, DialogBody, DialogFooter, CardHeader, Menu, MenuHandler, MenuList, MenuItem,Alert, } from "@material-tailwind/react"
import { ExclamationTriangleIcon,  CheckCircleIcon } from "@heroicons/react/24/solid"
import { BsThreeDotsVertical } from "react-icons/bs"
import UploadManga from "./UploadManga"
import useApi from "../hooks/useApi"

const MangaList = () => {
  // States for Manga data and loading/error handling
  const [manga, setManga] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(null)
  const [page, setPage] = useState(1)
  const [error, setError] = useState(null)
  const [featuredManga, setFeaturedManga] = useState([])
  const [recommendedManga, setRecommendedManga] = useState([])
  const api = useApi()

  // States for Dialog and Edit mode
  const [selectedManga, setSelectedManga]  = useState({})
  const [deleted, setDeleted] = useState(false)
  const [edit, setEdit] = useState(false)
  const [size, setSize] = useState(null)
  const [updated, setUpdated] = useState(false)
  const [open, setOpen] = useState(true)
  const [success, setSuccess] = useState(false)


  // Function to handle dialog opening and mode change
  const handleOpen = (mangaItem, value) => {
    setSelectedManga(mangaItem)
    setSize(value)

    if (edit) {
      setEdit(false)
    }

  }

  // Set succes to null
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(null)
      setError(null)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [success, error])


  // Function to fetch manga data
  useEffect(() => {
    const getManga = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/manga/all/paginated?page=${page}`)
        setHasNextPage(res.data.hasNextPage)
        setManga(res.data.manga)
      } catch (err) {
        setError(err.response.data.error)
      } finally {
        setLoading(false)
      }
    }

    getManga()
  }, [page, deleted, updated])

  useEffect(() => {  
    getFeaturedManga()
    getRecommendedManga()
  }, [])

  // Funtion to fetch FeaturedManga
  const getFeaturedManga = async () => {
    try {
      const res = await api.get("/featured/all")
      const featuredMangaList = res.data.featuredMangaList.map((manga) => manga._id)
      setFeaturedManga(featuredMangaList)
    } catch (err) {
      console.log(err)
      setError(err.response.data.error)
    }
  }

  // Funtion to fetch RecommendedManga
  const getRecommendedManga = async () => {
    try {
      const res = await api.get("/recommend/all")
      const recommendedManga = res.data.recommendedManga.map((manga) => manga._id)
      setRecommendedManga(recommendedManga)
    } catch (err) {
      console.log(err)
      setError(err.response.data.error)
    }
  }

  // Function to delete manga
  const deleteManga = async (mangaId) => {
    setDeleted(false)
    setSuccess(false)
    try {
      const res = await api.delete(`/manga/delete/${mangaId}`)
      setDeleted(true)
      setSuccess(res.data)
    } catch (err) {
      setError(err.response.data.error)
    }
  }

  // Function add to recommended
  const addToRecommended = async (mangaId) => {
    setSuccess(false)
    try {
      const res = await api.post(`/add/recommend/${mangaId}`)
      setSuccess(res.data)
      getRecommendedManga()
    } catch (err) {
      setError(err.response.data.error)
    }
  }

  const removeToRecommended = async (mangaId) => {
    setSuccess(false)
    try {
      const res = await api.delete(`/remove/recommend/${mangaId}`)
      setSuccess(res.data)
      getRecommendedManga()
    } catch (err) {
      console.log(err)
      setError(err.response.data.error)
    }
  }

  // Function add to featured
  const addToFeatured = async (mangaId) => {
    setSuccess(false)
    try {
      const res = await api.post(`/add/featured/${mangaId}`)
      setSuccess(res.data)
      getFeaturedManga()
    } catch (err) {
      console.log(err)
      setError(err.response.data.error)
    }
  }

  // Function remove from featured
  const removeFromFeatured = async (mangaId) => {
    setSuccess(false)
    try {
      const res = await api.delete(`/remove/featured/${mangaId}`)
      setSuccess(res.data)
      getFeaturedManga()
    } catch (err) {
      console.log(err)
      setError(err.response.data.error)
    }
  }

  // Functions to navigate between pages
  const next = () => hasNextPage && setPage((prevState) => prevState + 1)
  const prev = () => page !== 1 && setPage((prevState) => prevState - 1)


  return (
    <>
      {error && (
        <Alert
          variant="gradient"
          color="red"
          icon={<ExclamationTriangleIcon className="h-6 w-6" />}
          open={open}
          className="fixed top-0 left-0 z-50"
          action={
            <Button
              variant="text"
              color="white"
              size="sm"
              className="!absolute top-3 right-3"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert 
          icon={<CheckCircleIcon className="mt-px h-6 w-6" />}
          className="fixed top-0 left-0 rounded-none z-50"
          color="green"
          open={open}
          variant="gradient"
          action={
            <Button
              variant="text"
              color="white"
              size="sm"
              className="!absolute top-3 right-3"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          }
        >
          {success}
        </Alert>
      )}
      <Dialog open={edit ? size === "xxl" : size === "md"} size={size || "md"} handler={handleOpen}>
        <DialogHeader>{edit ? selectedManga.title : selectedManga.slug ? selectedManga.slug : "N/A"}</DialogHeader>
        <DialogBody divider className={`${edit && "py-10"} h-[40rem] overflow-y-scroll`}>
          {edit ? (
            <UploadManga edit={edit} selectedManga={selectedManga} setUpdated={setUpdated}/>
          ) : (
            <Card shadow={false}>
              <CardHeader shadow={false} color="blue-gray" floated={false} className="relative h-96">
                <img src={selectedManga.coverURL} alt={selectedManga.title} className="w-full h-full object-cover object-top" />
                <span className="absolute top-3 right-3 py-1 px-2 bg-blue-500 rounded-md text-sm">{selectedManga.type ? selectedManga.type : "N/A"}</span>
              </CardHeader>
              <CardBody className="pt-2 px-4">
                <div className="flex flex-wrap mb-4">
                  {selectedManga.genre && selectedManga.genre.length > 0 ? (
                    selectedManga.genre.map((item) => (
                      <Typography variant="small" className="bg-blue-gray-100 rounded-md mr-2 mb-1 px-2 py-1" key={item}>{item}</Typography>
                    ))
                  ) : (
                    <span>No genre data available.</span>
                  )}
                </div>
                <div className="mb-3">
                  <div className="flex justify-between items-center">
                    <Typography
                      color="blue-gray"
                    >
                      <span className="font-bold mr-1">Author:</span>
                      {selectedManga.author ? selectedManga.author : "N/A"}
                    </Typography>
                    <Typography
                      color="blue-gray"
                      variant="small"
                      className="font-bold"
                    >
                      {selectedManga.status ? selectedManga.status : "N/A"}
                    </Typography>
                  </div>
                  <Typography
                    color="blue-gray"
                  >
                    <span className='font-bold mr-1'>Released:</span>
                    {selectedManga.released ? selectedManga.released : "N/A"}
                  </Typography>
                  <Typography
                    color="blue-gray"
                  >
                    <span className='font-bold mr-1'>Updated On:</span>
                    {selectedManga.updatedAt ? format(new Date(selectedManga.updatedAt), "MMMM dd") : "N/A"}
                  </Typography>
                </div>
                <div className='flex justify-between'>
                  <Typography variant="h5" color="blue-gray" className="mb-2">
                    {selectedManga.title ? selectedManga.title : "N/A"}
                  </Typography>
                </div>
                <div>
                  {selectedManga.synopsis}
                </div>
              </CardBody>
            </Card>
          )}
        </DialogBody>
        <DialogFooter className='justify-center'>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>Close</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <Card>
        <div className="border-b flex">
          <Typography
            variant="h5"
            color="blue"
            className="p-4"
          >
            Manga Collection
          </Typography>
        </div>
        <CardBody className='p-3'>
          <div className="grid grid-cols-1 gap-4 px-2">
            {loading ? (
              <div className='flex justify-center items-center h-96'>
                <Spinner className="h-8 w-8"/>
              </div>
            ) : (
              manga.map((mangaItem) => (
                <div key={mangaItem._id} className="border-b px-4 py-1 flex justify-between items-center gap-4">
                  <div className="flex  mb-3">
                    <div onClick={() => handleOpen(mangaItem, "md")} className="flex-shrink-0 cursor-pointer">
                      <img  src={mangaItem.coverURL} alt={mangaItem.title} className="w-12 h-16 rounded-md md:w-16 md:h-20 2xl:w-20 2xl:h-24" />
                    </div>
                    <div className="ml-4">
                      <h2 onClick={() => handleOpen(mangaItem, "md")} className="text-lg font-medium cursor-pointer hover:text-blue-400">{mangaItem.title}</h2>
                      <div className="flex mt-1">
                        <p className="text-sm text-gray-500 mr-2">{mangaItem.bookmarkCount} {mangaItem.bookmarkCount === 0 ? "Bookmark" : "Bookmarks"}</p>
                        <p className="text-sm text-gray-500">{mangaItem.views} {mangaItem.views === 0 ? "View" : "Views"}</p>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-5'>
                    <span className="text-sm hidden md:inline-block">{format(new Date(mangaItem.createdAt), "MMMM dd, yyyy")}</span>
                    <Menu
                      animate={{
                        mount: { y: 0 },
                        unmount: { y: 25 },
                      }}
                    >
                      <MenuHandler>
                        <span className='text-2xl cursor-pointer'>
                          <BsThreeDotsVertical />
                        </span>
                      </MenuHandler>
                      <MenuList>
                        {featuredManga.includes(mangaItem._id) ? (
                          <MenuItem onClick={() => removeFromFeatured(mangaItem._id)}>Remove from Featured</MenuItem>
                        ) : (
                          <MenuItem onClick={() => addToFeatured(mangaItem._id)}>Add to Featured</MenuItem>
                        )}
                        {recommendedManga.includes(mangaItem._id) ? (
                          <MenuItem onClick={() => removeToRecommended(mangaItem._id)}>Remove from Recommend</MenuItem>
                        ) : (
                          <MenuItem onClick={() => addToRecommended(mangaItem._id)}>Add to Recommend</MenuItem>
                        )}
                        <MenuItem onClick={() => (setEdit(true), handleOpen(mangaItem, "xxl"))}>Edit</MenuItem>
                        <MenuItem onClick={() => deleteManga(mangaItem._id)}>Delete</MenuItem>
                      </MenuList>
                    </Menu>
                  </div>
                </div>
              ))
            )}
            <div className='flex justify-center items-center gap-3'>
              <Button variant='outlined' size='sm' onClick={prev} disabled={page === 1}>Prev</Button>
              <Button onClick={next} variant='outlined' size='sm' disabled={hasNextPage === false}>Next</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export default MangaList