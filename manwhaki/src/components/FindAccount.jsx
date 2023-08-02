import { useEffect, useState } from "react"
import { Button, Input, Spinner, Typography } from "@material-tailwind/react"
import api from "../lib/api"
import Cookies from "js-cookie"

const FindAccount = ({setMessage, setOpenForm}) => {
  const [email, setEmail] = useState("")
  const [username, setUsername]  = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [reqLink, setReqLink] = useState(false)


  // setError and username to null
  useEffect(() => {
    if (!email) {
      setUsername("")
      setError(null)
    }
  }, [email])


  // Function to find account
  const handleFindAccount = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post(`/auth/user/find/${email}`)
      setUsername(res.data.username)
    } catch (err)  {
      setError(err.response.data.error)
    } finally{
      setLoading(false)
    }
  }


  // Funtion to request a reset password link
  const handleRequestLink = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post(`auth/reset/link/${username}`)

      setMessage(res.data.message)
      setOpenForm(false)
      Cookies.set("resetToken", import.meta.env.VITE_RESET_TOKEN, {
        sameSite: "none",
        secure: true,
        expires: 5 / (24 * 60),
      })
    } catch (err) {
      console.log(err)
    } finally{
      setLoading(false)
    }
  }


  return (
    <>
      {reqLink ? (
        <form onSubmit={handleRequestLink} className="flex flex-col gap-8 border-b border-blue-gray-700 pb-4">
          <Typography className="text-gray-400">
            An email containing a reset password link will been sent to your registered email address. Please check your inbox and follow the instructions to reset your password.
          </Typography>
          <Button type="submit" size="sm" className="self-end capitalize font-normal shadow-none hover:shadow-none">
            {loading ? (
              <Spinner className="h-4 w-4" />
            ) : "Send Link"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleFindAccount} className="flex flex-col gap-4">
          {error && (
            email ? ( <span className="bg-red-400 rounded-md text-white px-4 py-1">{error}</span> ) : ""
          )} 
          <Input label="Enter Email" size="lg" required vallue={email} onChange={e => setEmail(e.target.value)} className="text-white"/>
          {username && (
            <span onClick={() => setReqLink(true)} className="text-center py-2 bg-100 rounded-md text-gray-400 duration-150 hover:bg-blue-500 hover:bg-opacity-10 hover:text-white cursor-pointer mb-5">
              {username ? username : "N/A"}
            </span>
          )}
          <Button type="submit" className={`capitalize font-normal shadow-none hover:shadow-none ${loading && "flex justify-center"}`}>
            {loading ? (
              <Spinner className="h-4 w-4" />
            ) : "Find account"}
          </Button>
        </form>
      )}
    </>
  )
}

export default FindAccount