import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Input, Typography } from "@material-tailwind/react"
import { BsSortNumericUpAlt, BsSortNumericDown  } from "react-icons/bs"
import { MangaChapterLoading } from "../LoadingComponents"
import api from "../../lib/api"
import useHandleErrors from "../../hooks/useHandleError"
import useGetChapterBookmarks from "../../hooks/useGetChapterBookmarks"
import useAddChapterBookmarks from "../../hooks/useAddChapterBookmark"
import useGlobalError from "../../hooks/useGlobalError"

const MangaChapter = () => {
  const [mangaChapters, setMangaChapters] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState("asc")
  const [searchTerm, setSearchTerm] = useState("")
  const { mangaSlug } = useParams()
  const navigate = useNavigate()
  const { setError } = useHandleErrors()
  const { chapterBookmark } = useGetChapterBookmarks()
  const { addChapterBookmarks } = useAddChapterBookmarks()
  const [mangaId, setMangaId] = useState(null)
  const [sortedChapters, setSortedChapters] = useState([])

  const { globalError, setGlobalError } = useGlobalError()


  useEffect(() => {
    const getAllChapter = async () => {
      setLoading(true)
      setError.error(null)
      setGlobalError(null)

      try {
      const res = await api.get(`/chapter/${mangaSlug}/all`)

      setMangaId(res.data.mangaId)

      
      const chapterIds = chapterBookmark.flatMap((bookmark) =>
        bookmark.chapters.map((chapter) => chapter._id)
      );

      const chapterWithReadFlag = res.data.chapterData.map((chapter) => ({
        ...chapter,
        read: chapterIds.includes(chapter._id),
      }));

      setMangaChapters(chapterWithReadFlag)
      } catch (err) {
        if (err.data && err.response.data) {
          setError.error(err.response.data.error)
        } else {
          setGlobalError("Network error occurred. Please try again later")
          console.log(err)
        }
      } finally {
        setLoading(false)
      }
    }

    getAllChapter()
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterBookmark])


  // Get the first and last chapters
  const lastChapter = mangaChapters.length > 0 ? mangaChapters[0] : null
  const firstChapter = mangaChapters.length > 0 ? mangaChapters[mangaChapters.length - 1] : null

  // Function to handle sorting
  const handleSortChapters = () => {
    const mangaChaptersCopy = [...mangaChapters].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.chapterNum - b.chapterNum
      } else {
        return b.chapterNum - a.chapterNum
      }
    })

    setMangaChapters(mangaChaptersCopy)
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  // Function to handle search
  const handleSearchChapters = (event) => {
    const { value } = event.target
    setSearchTerm(value)

    const filteredChapters = mangaChapters.filter((chapter) =>
      chapter.shortTitle.toLowerCase().includes(value.toLowerCase())
    )

    setSortedChapters(filteredChapters)
  }
  

  const handleFirstChapter = () => {
    navigate(`/${mangaSlug}/${firstChapter.slug}`)
    addChapterBookmarks(mangaId, firstChapter._id)
  }

  const handleLastChapter = () => {
    navigate(`/${mangaSlug}/${lastChapter.slug}`)
    addChapterBookmarks(mangaId, lastChapter._id)
  }


  if (globalError) return

  return (
    <>
      { loading ? (
        <MangaChapterLoading />
      ) : (
        <section className="bg-50 rounded-md mb-16">
          <div className="flex items-center justify-between p-4 gap-6">
            <Typography color="white" className="font-bold">Chapters</Typography>
            <div className="w-full">
              <div className="flex items-center gap-3">
                <hr className="border-gray-700 w-full"/>
                <span className="cursor-pointer text-white text-xl" onClick={handleSortChapters}>
                  {sortOrder === "asc" ? ( <BsSortNumericUpAlt /> ) : ( <BsSortNumericDown /> )}
                </span>
              </div>
            </div>
          </div>
          <div className="px-4">
            <div className="grid grid-cols-2 gap-6 mb-4">
              <Button
                disabled={mangaChapters.length === 0 && true}
                onClick={handleFirstChapter}
                className="shadow-none hover:shadow-none h-16 text-base capitalize"
              >
                {firstChapter ? firstChapter.shortTitle : "N/A"}
              </Button>
              <Button
                disabled={mangaChapters.length === 0 && true}
                onClick={handleLastChapter} 
                className="shadow-none hover:shadow-none h-16 text-base capitalize"
              >
                {lastChapter ? lastChapter.shortTitle : "N/A"}
              </Button>
            </div>
          </div>
          <div className="px-4 mb-4">
            <Input
              label="Search Chapter: Example Chapter 20 or 20"
              variant="standard"
              size="lg"
              className={`px-4 text-gray-400 text-sm !border-blue-gray-700 ${mangaChapters.length === 0 && "pointer-events-none"}`}
              value={searchTerm}
              onChange={handleSearchChapters}
              autoComplete="On"
            />
          </div>
          <ul className="max-h-[370px] overflow-y-scroll scroll">
            {searchTerm === "" ? (
              <>

                {mangaChapters.length > 0 ? (
                  mangaChapters.map((chapter) => (
                    <li key={chapter._id} className="mb-4 px-4">
                      <Link
                        onClick={() => addChapterBookmarks(mangaId, chapter._id)}
                        className={`px-4 py-3 border border-blue-gray-700 block rounded-md text-sm duration-150 hover:text-blue-500 ${chapter.read ? "text-blue-400" : "text-gray-400"}`}
                        to={`/${mangaSlug}/${chapter.slug}`}
                      >
                        {chapter.shortTitle}
                      </Link>
                    </li>
                  ))
                ) : (

                  <Typography color="white" className="text-center my-4 mb-8">
                    No chapter available
                  </Typography>
                )}

              </>

            ) : (

              <>

                {sortedChapters.length > 0 ? (
                  sortedChapters.map((chapter) => (
                    <li key={chapter._id} className="mb-4 px-4">
                      <Link
                        onClick={() => addChapterBookmarks(mangaId, chapter._id)}
                        className={`px-4 py-3 border border-blue-gray-700 block rounded-md text-sm duration-150 hover:text-blue-500 ${chapter.read ? "text-blue-400" : "text-gray-400"}`}
                        to={`/${mangaSlug}/${chapter.slug}`}
                      >
                        {chapter.shortTitle}
                      </Link>
                    </li>
                  ))
                  
                ) : (
                  <Typography color="white" className="text-center my-4 mb-8">
                    No chapter matches the search
                  </Typography>
                )}

              </>

            )}
          </ul>
        </section>
      )}
    </>
  )
}

export default MangaChapter
