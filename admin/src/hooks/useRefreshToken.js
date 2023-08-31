import api from "../lib/api"
import useAuth from "./useAuth"



const useRefreshToken = () => {
  const { state, setAuth } = useAuth()

  const resfresh = async () => {
    try {
      const res = await api.get("/auth/admin/refresh")

      setAuth({
        ...state,
        accessToken: res.data.accessToken
      })
      return res.data.accessToken
    } catch (err) {
      console.log(err)
    }
  }
  
  return resfresh
}

export default useRefreshToken