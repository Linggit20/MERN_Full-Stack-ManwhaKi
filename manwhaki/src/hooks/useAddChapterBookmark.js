import useApi from "./useApi"
import useAuth from "./useAuth"


const useAddChapterBookmarks = () => {
  const { state } = useAuth()
  const api = useApi()

  const addChapterBookmarks = async (mangaId, chapterId) => {
    if (!state.accessToken) return
    
    try {
      await api.post(`bookmarks/${mangaId}/${chapterId}`)

    } catch (err) {
      console.log(err)
    }
  }

  return { addChapterBookmarks }
}

export default useAddChapterBookmarks