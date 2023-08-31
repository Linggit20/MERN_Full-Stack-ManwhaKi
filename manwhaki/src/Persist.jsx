import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import useRefreshToken from "./hooks/useRefreshToken"


const Persist = () => {
  const [isReady, setIsReady] = useState(false)
  const refresh = useRefreshToken()

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh()
      } catch (err) {
        console.error(err)
      }  finally {
        setIsReady(true)
      }
    }

    const user = localStorage.getItem("user")

    if (user) {
      verifyRefreshToken()
    } else {
      setIsReady(true)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return isReady && <Outlet />
}

export default Persist
