import { useEffect, useState } from "react"
import api from "../lib/api"

const useGetManga = () => {
  const [manga, setManga] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)


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
  }, [])

  return { manga, loading} 
}

export default useGetManga