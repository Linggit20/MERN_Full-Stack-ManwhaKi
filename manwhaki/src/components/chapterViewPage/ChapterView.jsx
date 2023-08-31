import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../../lib/api"
import { Typography } from "@material-tailwind/react"
import MangaDisqus from "../MangaDisqus"
import { ChapterContentLoading } from "../LoadingComponents"
import useGlobalError from "../../hooks/useGlobalError"
import useAddChapterBookmarks from "../../hooks/useAddChapterBookmark"


const ChapterView = () => {
  const { mangaSlug, chapterSlug } = useParams()
  const [allChapter, setAllChapter] = useState([])
  const [chapterContent, setChapterContent] = useState({})
  const [loading, setLoading] = useState(false)
  const [mangaId, setMangaId] = useState(null)
  const { addChapterBookmarks } = useAddChapterBookmarks()

  const mangaTitle = mangaSlug.split("-").map((text) => text.charAt(0).toUpperCase() + text.slice(1)).join(" ")
  const navigate = useNavigate()

  const { globalError, setGlobalError } = useGlobalError()
 

  useEffect(() => {
    const getChapterContent = async () => {
      setLoading(true)
      setGlobalError(null)

      try {
        const res = await api.get(`/chapter/${chapterSlug}`)  
          
        setChapterContent(res.data)
        addChapterToBookmark(res.data._id)
      } catch (err) {
        setGlobalError("Network error occurred. Please try again later")
      } finally {
        setLoading(false)
      }
    }

    getChapterContent()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterSlug])


  useEffect(() => {
    const getAllChapter = async () => {
      setGlobalError(null)
      try {
        const res = await api.get(`/chapter/${mangaSlug}/all`)

        setAllChapter(res.data.chapterData)
        setMangaId(res.data.mangaId)
      } catch (err) {
        setGlobalError("Network error occurred. Please try again later")
      }
    }

    getAllChapter()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mangaSlug])


  if (globalError) {
    return (
      <div className="px-4 mt-16">
        <ChapterContentLoading />
      </div>
    )
  }

  const addChapterToBookmark = (chapterId) => {
    if (mangaId && chapterContent) {
      addChapterBookmarks(mangaId, chapterId)
    }
  }

  return (
    <>
      <section className="mb-32">
        <div className="text-center px-4 py-10 mb-6">
          { chapterContent && chapterContent.fullTitle && (
            <>
              <Typography variant="h1" className="text-gray-200 text-2xl mb-3">{chapterContent.fullTitle}</Typography>
              <Typography className="text-gray-300 text-sm">
                All chapter are in{" "}
                <Link to={`/series/${mangaSlug}`} className="text-blue-400 transition-colors hover:text-blue-500 outline-none focus:outline-blue-500">{mangaTitle}</Link>
              </Typography>
            </>
          )}
        </div>
        { !loading && (
          <div className="mb-5 px-4 flex justify-between items-center">
            <select
              className="px-4 py-1.5 rounded-full bg-50 text-[13px] text-white outline-none focus:outline-blue-500"
              onChange={(e) => navigate(`/${mangaSlug}/${e.target.value}`)}
              value={chapterSlug}
            >
              {allChapter.map((chapter) => (
                <option key={chapter._id} value={chapter.slug}>
                  {chapter.shortTitle}
                </option>
              ))}
            </select>
            <div className="flex space-x-4 items-center text-[13px] text-white">
              <Link
                to={`/${mangaSlug}/${chapterContent?.chapterNav?.prevSlug}`}
                aria-disabled={chapterContent?.chapterNav?.prevSlug === "" ? "true" : "false"}
                className={`bg-blue-500 px-4 rounded-full py-1 outline-none focus:outline-blue-500 ${chapterContent?.chapterNav?.prevSlug === "" && "pointer-events-none bg-opacity-40"}`}
              >
                Prev
              </Link>
              <Link
                to={`/${mangaSlug}/${chapterContent?.chapterNav?.nextSlug}`}
                aria-disabled={chapterContent?.chapterNav?.nextSlug === "" ? "true" : "false"}
                className={`bg-blue-500 px-4 rounded-full outline-none focus:outline-blue-500 py-1 ${chapterContent?.chapterNav?.nextSlug === "" && "pointer-events-none bg-opacity-40"}`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
        <ul className="lg:px-4 mb-5">
          <>
            { loading ? (
              <ChapterContentLoading />
            ) : (
              <>
                { chapterContent && chapterContent.contentURL && (
                  chapterContent.contentURL.map((content, index) => (
                    <li key={index}>
                      <img className="block mx-auto" src={content} alt={`Image ${index + 1}`} loading="lazy" />
                    </li>
                  ))
                )}
              </>
            )}
          </>
        </ul>
        <div className="mb-4 px-4 flex justify-between items-center">
          <select
            className="px-4 py-1.5 rounded-full bg-50 text-[13px] text-white outline-none focus:outline-blue-500"
            onChange={(e) => navigate(`/${mangaSlug}/${e.target.value}`)}
            value={chapterSlug}
          >
            {allChapter.map((chapter) => (
              <option key={chapter._id} value={chapter.slug}>
                {chapter.shortTitle}
              </option>
            ))}
          </select>
          <div className="flex space-x-4 items-center text-[13px] text-white">
            <Link
              to={`/${mangaSlug}/${chapterContent?.chapterNav?.prevSlug}`}
              aria-disabled={chapterContent?.chapterNav?.prevSlug === "" ? "true" : "false"}
              className={`bg-blue-500 px-4 rounded-full py-1 outline-none focus:outline-blue-500 ${chapterContent?.chapterNav?.prevSlug === "" && "pointer-events-none bg-opacity-40"}`}
            >
              Prev
            </Link>
            <Link
              to={`/${mangaSlug}/${chapterContent?.chapterNav?.nextSlug}`}
              aria-disabled={chapterContent?.chapterNav?.nextSlug === "" ? "true" : "false"}
              className={`bg-blue-500 px-4 rounded-full outline-none focus:outline-blue-500 py-1 ${chapterContent?.chapterNav?.nextSlug === "" && "pointer-events-none bg-opacity-40"}`}
            >
              Next
            </Link>
          </div>
        </div>
      </section>
      <section className="mb-32">
        <MangaDisqus />
      </section>
    </>
  )
}

export default ChapterView