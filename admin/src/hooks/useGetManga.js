import { useEffect, useState } from "react"
import useApi from "./useApi"


const useGetManga = () => {
  const [manga, setManga] = useState([])
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null)
  const api = useApi()


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await api.get("/manga/all")
        const data = res.data.manga
        setManga(data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { manga, loading} 
}

export default useGetManga