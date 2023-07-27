import React, { useState, useEffect } from "react"
import useGetManga from "../hooks/useGetManga"
import { Button, Card, CardBody, Input, Spinner, Typography, Alert } from "@material-tailwind/react"
import { ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon, } from "@heroicons/react/24/solid"
import api from "../lib/api"
import ChapterForm from "./ChapterForm"

const UploadChapter = () => {
const [isLoading, setIsLoading] = useState(false)
const [isLoadingTwo, setIsLoadingTwo] = useState(false)
const [success, setSuccess] = useState(false)
const [message, setMessage] = useState(null)
const [isError, setIsError] = useState(null)
const [open, setOpen] = useState(true)

// Manga-related states
const { manga, loading, error } = useGetManga()
const [searchTerm, setSearchTerm] = useState("")
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
const [selectedManga, setSelectedManga] = useState(null)
const [websiteLink, setWebsiteLink] = useState("")
const [imageUrls, setImageUrls] = useState([])

// Chapter-related states
const [chapter, setChapter] = useState({})
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
    setChapterData((prevData) => ({
      ...prevData,
      fullTitle: chapter?.fullTitle || "",
      slug: chapter?.slug || "",
      shortTitle: chapter?.shortTitle || "",
      chapterNum: chapter?.chapterNum || "",
      chapterNav: {
        prevSlug: chapter?.chapterNav?.prevSlug || "", 
        nextSlug: chapter?.chapterNav?.nextSlug || "",
      },
    }))
  }, [chapter])

  useEffect(() => {
    setChapterData((prevData) => ({
      ...prevData,
      contentURL: imageUrls && imageUrls,
    }))
  }, [imageUrls])

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false)
      setIsError(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [success, isError])



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



  const filteredManga = manga.filter((mangaItem) =>
    mangaItem.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  )



  const getMangaChapters = async (mangaId) => {
    try{
      const res = await api.get(`/manga/${mangaId}`)
      setChapter(res.data.chapterData[0])
    } catch (err) {
      console.log(err)
    }
  }

  const scrapeWebsiteData = async (e) => {
    e.preventDefault()
    setIsLoadingTwo(true)
    try {
      const res= await api.get(`/scrape?link=${encodeURIComponent(websiteLink)}`)
      setImageUrls(res.data.imageUrls)
      setWebsiteLink("")
    } catch (err) {
      console.log(err)
      setIsError(err.response.data.error)
    } finally {
      setIsLoadingTwo(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(false)
    try{
      const res = await api.post(`/upload/chapter/${selectedManga._id}`, chapterData)
      setSuccess(true)
      setMessage(res.data)
      setChapterData((prevData) => ({
        ...prevData,
        contentURL: [],
      }))
    } catch (err) {
      setIsError(err.response.data.error)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <>
      {isError && (
        <Alert
          variant="gradient"
          color="red"
          icon={<ExclamationTriangleIcon className="h-6 w-6" />}
          open={open}
          className='fixed top-0 left-0 z-50'
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
          {message}
        </Alert>
      )}
      <Card className={`${selectedManga && "mb-10"}`}>
        <CardBody>
          <Typography variant="h4" color="blue" className="mb-4">
            Upload Chapter Here
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
            <CardBody className="bg-teal-400 text-white rounded-lg">
              <Typography
                variant="h5"
              >
                {selectedManga ? selectedManga.title  : "No selected Manga"}
              </Typography>
            </CardBody>
          </Card>
          <Card className="mb-6" shadow={false}> 
            <CardBody>
              <form onSubmit={scrapeWebsiteData}>
                <Typography className="mb-2">
                  Scrape Data Content URL (images) from website - Auto fill the Content URLs
                </Typography>
                <div>
                  <Input
                    type="text"
                    id="websiteLink"
                    name="websiteLink"
                    label="Website Link"
                    size="lg"
                    value={websiteLink}
                    required
                    onChange={e => setWebsiteLink(e.target.value)}
                  />
                  <Typography variant="small" color="gray" className="flex items-center gap-1 font-normal mt-2">
                    <InformationCircleIcon className="w-4 h-4 -mt-px" />
                    Example Link: https://asura.gg/2226495089-solo-leveling-chapter-2/
                  </Typography>
                </div>
                <Button type="submit" className="block mt-5">
                  {isLoadingTwo ? (
                    <Spinner className="h-4 w-4"/> 
                  ) : "Confirm"}
                </Button>
              </form>
            </CardBody>
          </Card>
          <ChapterForm chapterData={chapterData} setChapterData={setChapterData}  handleInputChange={handleInputChange} handleContentURLChange={handleContentURLChange} handleSubmit={handleSubmit} isLoading={isLoading}/>
        </>
      )}
    </>
  )
}

export default UploadChapter
