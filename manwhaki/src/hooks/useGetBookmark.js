import { useEffect, useState } from "react"
import useAuth from "./useAuth"
import useApi from "./useApi"

const useGetBookmarks = () => {
  const [bookmarked, setBookmarked] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false)
  const [mangaIds, setMangaIds] =  useState([])

  const api = useApi()
  const { state } = useAuth()

  useEffect(() => {
    const getBookmarkedManga = async () => {
      try {
        const res = await api.get("/users/bookmarks")


        const bookmarksData = res.data.bookmarkedManga || [];
        setBookmarked(bookmarksData)

        if (bookmarksData.length !== 0) {
          setMangaIds(bookmarksData.map((item => item.manga?._id)))
        }
      } catch (err) {
        console.log(err)
      }
    }

    if (state.accessToken) {
      getBookmarkedManga()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { bookmarked, mangaIds, loading }
}

export default useGetBookmarks