import { useEffect } from "react"
import api from "../lib/api"
import useAuth from "./useAuth"
import useRefreshToken from "./useRefreshToken"


const useApi = () => {
  const refresh = useRefreshToken()
  const { auth } = useAuth()

    useEffect(() => {
    const reqIntercept = api.interceptors.request.use(
      config  => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth.accessToken}`
        }
        
        return config
      }, (err) => Promise.reject(err)

    )

    const resIntercept = api.interceptors.response.use(
      res => res,
      async (err) => {
        const prevRequest = err.config
        if (err.response.status === 403 && !prevRequest.sent) {
          prevRequest.sent = true
          const newAccessToken = await refresh()
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`

          return api(prevRequest)
        }

        return Promise.reject(err)
      }
    )

    return () =>  {
      api.interceptors.request.eject(reqIntercept)
      api.interceptors.response.eject(resIntercept)
    }

  }, [auth, refresh])

  return api
}

export default useApi