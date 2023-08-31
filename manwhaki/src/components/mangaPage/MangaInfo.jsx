import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button, Spinner, Typography } from "@material-tailwind/react"
import { parseISO, format }from "date-fns"
import { MangaInfoLoading } from "../LoadingComponents"
import api from "../../lib/api"
import MangaChapter from "./MangaChapter"
import MangaDisqus from "../MangaDisqus"
import useGetBookmarks from "../../hooks/useGetBookmark"
import useGlobalError from "../../hooks/useGlobalError"
import useAuth from "../../hooks/useAuth"
import useApi from "../../hooks/useApi"

const MangaInfo = () => {
  const { mangaSlug } = useParams()
  const [manga, setManga] = useState({})
  const [bookmark, setBookmark] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const { mangaIds } = useGetBookmarks()
  const navigate = useNavigate()

  const { state } =  useAuth()
  const apiAuthenticated = useApi()
  const { globalError, setGlobalError } = useGlobalError()


  let postedOn = "N/A"
  let updatedOn = "N/A"

  if (manga.createdAt) {
    const parsedDate = parseISO(manga.createdAt)
    postedOn = format(parsedDate, "MMMM dd, yyyy")
  }

  if (manga.updatedAt) {
    const parsedDate = parseISO(manga.updatedAt)
    updatedOn = format(parsedDate, "MMMM dd, yyyy")
  }


  useEffect(() => {
    getManga()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mangaSlug])

  useEffect(() => {
    const isMangaBookmarked = mangaIds.includes(manga?._id)
    setBookmark(isMangaBookmarked)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mangaIds])


  const getManga = async () => {
    setLoading(true)
    setGlobalError(null)

    try {
      const res = await api.get(`/single/${mangaSlug}`)

      setManga(res.data)
    } catch (err) {
      setGlobalError("Network error occurred. Please try again later")
    } finally {
      setLoading(false)
    }
  }


  // Add or remove Manga from bookmarks
  const toggleBookmark = async (mangaId) => {
    setBookmarkLoading(true)

    if (!state.accessToken) {
      navigate("/login")
      return
    }
    try {
      if (bookmark) {
        const res = await apiAuthenticated.post(`bookmark/remove/manga/${mangaId}`)

        setBookmark(false)
        console.log(res)
      } else {
        // eslint-disable-next-line no-unused-vars
        const res = await apiAuthenticated.post(`/bookmark/add/manga/${mangaId}`)

        setBookmark(true)
        console.log(res)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setBookmarkLoading(false)
    }
  }

  if (globalError) {
    return (
      <MangaInfoLoading />
    )
  }

  return (
    loading ? (
      <MangaInfoLoading />
    ) : (
      <>
        <img src={manga?.coverURL} alt={manga?.title} className="h-[30vh] w-full blur-3xl object-cover object-top"/>
        <div className="flex flex-col gap-8 md:gap-4 justify-center relative bottom-36 md:justify-start md:flex-row">
          <section className="w-72 self-center md:self-start">
            <div className="bg-50 p-2 rounded-md mb-6">
              <img src={manga?.coverURL} alt={manga?.title} className="rounded-md"/>
            </div>
            <Button 
              className={`capitalize flex justify-center shadow-none hover:shadow-none font-normal ${bookmark && "bg-red-500"}`}
              onClick={() => toggleBookmark(manga?._id)}
              fullWidth
              >
                { bookmarkLoading ? ( <Spinner className="h-4 w-4" /> ) : bookmark ? "Bookmarked" : "Bookmark" }
              </Button>
          </section>
          <div className="w-full">
            <section className="bg-50 p-4 rounded-md text-white  mb-12">
              <Typography variant="h5" color="white" className="mb-6">{manga.title ? manga.title : "N/A"}</Typography>
                <span className="text-base mb-2 block">Synopsis</span>
              <Typography className="text-gray-400 mb-10 whitespace-pre-line">{manga.synopsis ? manga.synopsis : "N/A"}</Typography>
              <div className="grid grid-cols-2 gap-10 mb-8">
                <div>
                  <Typography>Status</Typography>
                  <span className="text-[13px] text-gray-400">{manga?.status}</span>
                </div>
                <div>
                  <Typography>Type</Typography>
                  <span className="text-[13px] text-gray-400">{manga?.type}</span>
                </div>
                <div>
                  <Typography>Released</Typography>
                    <span className="text-[13px] text-gray-400">{manga?.released === "" ? "-" : manga?.released}</span>
                </div>
                <div>
                  <Typography>Author</Typography>
                  <span className="text-[13px] text-gray-400">{manga?.author === "" ? "-" : manga?.author}</span>
                </div>
                <div>
                  <Typography>Posted On</Typography>
                  <span className="text-[13px] text-gray-400">{postedOn}</span>
                </div>
                <div>
                  <Typography>Updated On</Typography>
                  <span className="text-[13px] text-gray-400">{updatedOn}</span>
                </div>
              </div>
              <>
                <Typography  className="mb-1">Genres</Typography>
                <ul className="flex flex-wrap">
                  {manga.genre?.map((item) => (
                    <li key={item} className="bg-blue-gray-900 py-1 px-3 rounded-md mb-2 mr-2 text-[12px] text-gray-300">{item}</li>
                ))}
                </ul>
              </>
            </section>
            <MangaChapter mangaId={manga._id}/>
            <section>
              <MangaDisqus />
            </section>
          </div>
        </div>
      </>
    )
  )
}

export default MangaInfo
