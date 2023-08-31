import { useCallback, useEffect, useState } from "react"
import { Card, Input, Button, Typography, Spinner, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react"
import { Link } from "react-router-dom"
import Cookies from "js-cookie"
import api from "../../lib/api"
import useHandleErrors from "../../hooks/useHandleError"
import usePageTitle from "../../hooks/usePageTitle"
import Footer from "../../components/Footer"
import useGlobalError from "../../hooks/useGlobalError"
import useAuth from "../../hooks/useAuth"


const FindAccount = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [open, setOpen] = useState(false)
  const { errors, setError, clearErrors } = useHandleErrors()
  usePageTitle("Find Account")

  const { dispatch } = useAuth()
  const { setGlobalError } = useGlobalError()

  
  const handleOpen = () => setOpen(!open)

  // Clear success messages after a certain time
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [message])

  // Handle email change
  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value)
    clearErrors()
    setUsername("")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // Handle find email
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setGlobalError(null)

    try {
      const res = await api.post(`/auth/user/find/${email}`)

      setUsername(res.data.username)
    } catch (err) {
      // Handle API error responses
      if (err.response && err.response.data) {
        setError.emailError(err.response.data.error)
      } else {
        // Handle error responses
        setGlobalError("Network error occurred. Please try again later")
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle request password link
  const handleSendResetLink = async () => {
    setLoading(true)
    setGlobalError(null)

    try {
      const res = await api.post(`auth/reset/link/${username}`)

      setOpen(false)
      setEmail("")
      setUsername("")

      dispatch({
        type: "SET_MESSAGE",
        payload: {
          accessToken: "",
          user: "",
          message: res.data.message
        }
      })
      Cookies.set("resetToken", import.meta.env.VITE_RESET_PASS_TOKEN, {
        sameSite: "strict",
        secure: true,
        expires: new Date(Date.now() + 5 * 60 * 1000)
      })
    } catch (err) {
      if (err.response) {
        // Handle API error responses and close the dialog
        if (err.response.status === 400) {
          dispatch({
            type: "SET_MESSAGE",
            payload: {
              accessToken: "",
              user: "",
              message: err.response.data.message
            }
          })
          setOpen(false)
        }
      } else {
        // Handle errors or unexpected errors then close the dialog
        setGlobalError("Network error occurred. Please try again later")
        setOpen(false)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} size="sm" handler={handleOpen} className="bg-50">
        <DialogHeader className="text-white">Reset Password Link</DialogHeader>
        <hr className="border-blue-gray-900"/>
        <DialogBody className="text-gray-400">
          An email containing a reset password link will been sent to your registered email address.
          Please check your inbox and follow the instructions to reset your password.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button onClick={handleSendResetLink} variant="gradient" color="green" className="shadow-none hover:shadow-none">
            { loading ? ( <Spinner className="h-4 w-4"/> ) : "Confirm"}
          </Button>
        </DialogFooter>
      </Dialog>
      <main>
        <div className="container flex items-center justify-center h-[75vh]">
          <Card color="transparent" shadow={false} className="text-gray-300">
            <Typography variant="h1" color="blue" className="text-3xl">
              Find Account
            </Typography>
            <Typography className="mt-1 font-normal">
              Enter your email address
            </Typography>
            { errors.emailError && (
              <Typography className="mt-4 font-normal bg-red-500 text-white px-3 py-1 text-sm rounded-sm">
                {errors.emailError}
              </Typography>
            )}
            <form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
              <div className="mb-4 flex flex-col gap-6">
                <Input
                  className="text-gray-300"
                  size="lg"
                  label="Email"
                  name="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  autoComplete="off"
                  error={errors.emailError && true}
                  autoFocus
                />
              </div>
              { username && (
                <div>
                  <Typography  className="text-[12px] font-bold text-blue-500 mb-1">
                    Account Result
                  </Typography>
                  <Typography onClick={handleOpen} className="text-center bg-50 py-2 rounded-md cursor-pointer duration-150 hover:bg-blue-gray-900">
                    {username}
                  </Typography>
                </div>
              ) }
              <Button type="submit" className={`mt-6 shadow-none hover:shadow-none ${loading && "flex justify-center"}`} fullWidth>
               { loading ? ( <Spinner className="w-4 h-4" /> ) : "Find  Account" }
              </Button>
              <Link to="/login" className="font-medium text-sm mt-4 block text-blue-500 transition-colors hover:text-blue-700">
                Go back
              </Link>
            </form>
          </Card>
        </div>
      </main>
      <footer className="fixed bottom-0 w-full">
        <Footer />
      </footer>
    </>
  )
}

export default FindAccount