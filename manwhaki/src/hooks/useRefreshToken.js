import api from "../lib/api"
import useAuth from "./useAuth"


const useRefreshToken = () => {
  const { state, dispatch } = useAuth()

  const resfresh = async () => {
    try {
      const res = await api.get("/auth/refreshToken")

      dispatch({type: "LOGIN", payload: {
        ...state,
        accessToken: res.data.accessToken,
        user: res.data.user
      }})

      return res.data.accessToken
    } catch (err) {
      localStorage.removeItem("user")
    }
  }
  
  return resfresh
}

export default useRefreshToken