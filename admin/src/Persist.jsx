import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import useRefreshToken from "./hooks/useRefreshToken"
import useAuth from "./hooks/useAuth"


const Persist = () => {
  const [isReady, setIsReady] = useState(false)
  const refresh = useRefreshToken()
  const { auth  } = useAuth()

  useEffect(() => {
    const verifyRefreshToken =async () => {
      try {
        await refresh()
      } catch (err) {
        console.log(err)
      }  finally {
        setIsReady(true)
      }
    }

    if (!auth.accessToken) {
      verifyRefreshToken()
    } else {
      setIsReady(true)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return isReady && <Outlet />
}

export default Persist
