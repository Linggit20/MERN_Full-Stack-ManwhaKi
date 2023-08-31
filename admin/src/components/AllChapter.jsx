import { useEffect, useState } from "react"
import useGetManga from "../hooks/useGetManga"
import { Card, CardBody, Input, Spinner, Typography, Menu, MenuHandler, MenuList, MenuItem, Alert, Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react"
import { ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/solid"
import { BsThreeDotsVertical } from "react-icons/bs"
import ChapterForm from "./ChapterForm"
import useApi from "../hooks/useApi"


const AllChapter = () => {
  // States for API calls and loading/error handling
  // eslint-disable-next-line no-unused-vars
  const { manga, loading, error } = useGetManga()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(null)
  const [isDeleted, setIsDeleted] = useState(false)
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState("")
  const api = useApi()

  // States for Manga-related data
  const [chapter, setChapter] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedManga, setSelectedManga] = useState(null)

  // States for Dialog and Edit mode
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState({})
  const [isEdit, setIsEdit] = useState(false)
  const [size, setSize] = useState(null)

  // State for Chapter Form data
  const [chapterData, setChapterData] = useState({
    fullTitle: "",
    slug: "",
    shortTitle: "",
    chapterNum: "",
    chapterNav: {
      prevSlug: "",
      nextSlug: "",
    },
    contentURL: [],
  })


  const handleOpenDialog = (value) => {
    setOpenDialog(!openDialog)
    setSize(value)
    if (isEdit) {
      setIsEdit(false)
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 800)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])


  useEffect(() => {
    setSelectedManga(null)
  }, [debouncedSearchTerm])


  useEffect(() => {
    if (selectedManga) {
      getMangaChapters(selectedManga._id)
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleted])

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false)
      setIsError(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [success, isError])

  useEffect(() => {
    setChapterData((prevData) => ({
      ...prevData,
      fullTitle: selectedChapter?.fullTitle || "",
      slug: selectedChapter?.slug || "",
      shortTitle: selectedChapter?.shortTitle || "",
      chapterNum: selectedChapter?.chapterNum || "",
      chapterNav: {
        prevSlug: selectedChapter?.chapterNav?.prevSlug || "", 
        nextSlug: selectedChapter?.chapterNav?.nextSlug || "",
      },
      contentURL: selectedChapter?.contentURL || []
    }))
  }, [selectedChapter])

  const filteredManga = manga.filter((mangaItem) =>
    mangaItem.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setChapterData((prevData) => ({
      ...prevData,
      [name]: value 
    }))
  }


  const handleContentURLChange = (e, index) => {
    const { value } = e.target
    setChapterData((prevData) => ({
      ...prevData,
      contentURL: prevData.contentURL.map((url, i) => (i === index ? value : url)).filter(Boolean)
    }))
  }

  const getMangaChapters = async (mangaId) => {
    setIsLoading(true)
    try{
      const res = await api.get(`/manga/${mangaId}`)
      setChapter(res.data.chapterData)
    } catch (err) {
      setIsError(err.response.data.error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteChapter = async (chapterId) => {
    setIsDeleted(false)
    setSuccess(false)
    try{
      const res = await api.delete(`/manga/chapter/delete/${chapterId}`)
      setMessage(res.data)
      setIsDeleted(true)
      setSuccess(true)
    } catch (err) {
      setIsError(err.response.data.error)
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(false)
    try{
      const res = await api.put(`/chapter/update/${selectedChapter._id}`, chapterData)
      getMangaChapters(selectedManga?._id)
      handleOpenDialog(null)
      setSuccess(true)
      setMessage(res.data)
    } catch (err) {
      setIsError(err.response.data.err)
    }
  }

  return (
    <div>
      {isError && (
        <Alert
          variant="gradient"
          color="red"
          icon={<ExclamationTriangleIcon className="h-6 w-6" />}
          open={open}
          className="fixed top-0 left-0 z-50"
        >
          {isError}
        </Alert>
      )}
      {success && (
        <Alert 
          icon={<CheckCircleIcon className="mt-px h-6 w-6" />}
          className="fixed top-0 left-0 rounded-none z-50"
          color="green"
          open={open}
          variant="gradient"
        >
          {message}
        </Alert>
      )}
      <Dialog open={openDialog} size={size} handler={handleOpenDialog}>
        <DialogHeader>  {selectedChapter && Object.keys(selectedChapter).length > 0 ? selectedChapter.fullTitle : "N/A"}</DialogHeader>
        <DialogBody divider className={`${isEdit ? "max-h-[40rem]" : "h-[40rem]"} overflow-scroll`}>
          {isEdit ? (
            <ChapterForm chapterData={chapterData} setChapterData={setChapterData} handleInputChange={handleInputChange} handleContentURLChange={handleContentURLChange} selectedManga={selectedManga} handleSubmit={handleSubmit}/>
          ) : (
            <Card>
              <CardBody>
                <Typography color="blue-gray" className="mb-1">
                  <span className="font-bold">Full Title: </span>
                  {selectedChapter ? selectedChapter.fullTitle : "N/A"}
                </Typography>
                <Typography color="blue-gray" className="mb-1">
                  <span className="font-bold">Slug: </span>
                  {selectedChapter ? selectedChapter.slug : "N/A"}
                </Typography>
                <Typography color="blue-gray" className="mb-1">
                  <span className="font-bold">Short Title: </span>
                  {selectedChapter ? selectedChapter.shortTitle : "N/A"}
                </Typography>
                <Typography color="blue-gray" className="mb-1">
                  <span className="font-bold">Chapter Number: </span>
                  {selectedChapter ? selectedChapter.chapterNum : "N/A"}
                </Typography>
                <Typography color="blue-gray" className="mb-1">
                  <span className="font-bold">Previous Slug: </span>
                  {selectedChapter ? selectedChapter.chapterNav?.prevSlug : "N/A"}
                </Typography>
                <Typography color="blue-gray" className="mb-1">
                  <span className="font-bold">Next Slug: </span>
                  {selectedChapter ? selectedChapter.chapterNav?.nextSlug : "N/A"}
                </Typography>
                <ul>
                  <Typography color="blue-gray" className="mb-1 font-bold">Content URL:</Typography>
                  {selectedChapter && selectedChapter.contentURL ? selectedChapter.contentURL.map((url, index) => (
                    <li key={index} className="mb-2">
                      <span className="mr-1 font-bold">{index + 1}.</span>
                      {url}
                    </li>
                  ))
                : "N/A"}
                </ul>
              </CardBody>
            </Card>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" color="green" onClick={() => handleOpenDialog(null)}>
            <span>Close</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <Card className={`${selectedManga && "mb-10"}`}>
        <CardBody>
          <Typography variant="h4" color="blue" className="mb-4">
            All Chapter of Manga will be Here
          </Typography>
          <Typography variant="h6" color="blue-gray" className="mb-3">
            Select a manga
          </Typography>
          <div className="mb-2">
            <Input
              type="text"
              label="Search manga by title"
              size="lg"
              id="searchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filteredManga.length > 0 ? (
            <ul className="max-h-80 overflow-y-scroll p-4">
              {filteredManga.map((mangaItem) => (
                <li
                  key={mangaItem._id}
                  onClick={() => (setSelectedManga(mangaItem), getMangaChapters(mangaItem._id))}
                  className="flex gap-4 mb-2 border-b py-2 group cursor-pointer"
                >
                  <img src={mangaItem.coverURL} alt={mangaItem.title} className="w-16 h-20 rounded-md" />
                  <Typography variant="h6" className="group-hover:text-blue-500">{mangaItem.title}</Typography>
                </li>
              ))}
            </ul>
          ) : loading ? (
            <div className="flex justify-center my-5 mt-10">
              <Spinner />
            </div>
          ) : (
            <Typography variant="h5" color="blue-gray" className="text-center my-5 mt-10">
              No manga found.
            </Typography>
          )}
        </CardBody>
      </Card>
      {selectedManga && (
        <>
          <Card className="mb-6">
            <CardBody className="bg-teal-400 rounded-lg">
              <Typography
                variant="h5"
                color="white"
              >
                All Chapter of {selectedManga.title}
              </Typography>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <ul className={`${isLoading ? "flex justify-center" : "sm:grid sm:grid-cols-2 sm:gap-4 max-h-[580px] overflow-y-scroll pr-4" }`}>
                {isLoading ? (
                  <Spinner />
                ) : (
                  chapter.length === 0 ? (
                    <Typography>
                      No Chapter Available
                    </Typography>
                  ) : (
                    chapter.map((chapterItem) => (
                      <li key={chapterItem._id} className="border py-3 px-4 rounded-md mb-4 sm:mb-0 flex justify-between items-center transition-colors duration-150 hover:bg-blue-200 hover:bg-opacity-30 hover:border-transparent hover:text-blue-gray-800">
                        <Typography onClick={() => (setSelectedChapter(chapterItem), handleOpenDialog("xl"))} className="cursor-pointer flex-1">
                          {chapterItem.shortTitle}
                        </Typography>
                        <div>
                          <Menu
                            animate={{
                              mount: { y: 0 },
                              unmount: { y: 25 },
                            }}
                          >
                            <MenuHandler>
                              <span className="text-xl cursor-pointer">
                                <BsThreeDotsVertical />
                              </span>
                            </MenuHandler>
                            <MenuList>
                              <MenuItem onClick={() => (setIsEdit(true), handleOpenDialog("xl"), setSelectedChapter(chapterItem))}>Edit</MenuItem>
                              <MenuItem onClick={() => deleteChapter(chapterItem._id)}>Delete</MenuItem>
                            </MenuList>
                          </Menu>
                        </div>
                      </li>
                    ))
                  )
                )}
              </ul>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  )
}

export default AllChapter