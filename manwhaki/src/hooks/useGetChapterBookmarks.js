import { useEffect, useState } from "react"
import useApi from "./useApi"
import useAuth from "./useAuth"


const useGetChapterBookmarks = () => {
  const [chapterBookmark, setChapterBookmark] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false)

  const api = useApi()
  const { state } = useAuth()

  useEffect(() => {
    const getAllChapterBookmark = async () => {
      try  {
        const res  = await api.get("/bookmarks/chapter")

        setChapterBookmark(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    if (state.accessToken) {
      getAllChapterBookmark()
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { chapterBookmark, loading }
  
}

export default  useGetChapterBookmarks