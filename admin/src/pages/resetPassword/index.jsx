import { useState } from "react"
import { Card, Input, Button, Typography, Spinner, Dialog, DialogBody, DialogHeader, DialogFooter, Alert } from "@material-tailwind/react"
import api from "../../lib/api"
import { Link } from "react-router-dom"
import {  AiFillCheckCircle  } from "react-icons/ai"
import { FaBookReader } from "react-icons/fa"
import Cookies from "js-cookie"

const ResetPassword = () => {
  const [info, setInfo] = useState({})
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(!open)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.get(`/auth/admin/find/${email}`)

      setInfo(res.data)
    } catch (err) {
      console.log(err)
      setError(err.response.data.message)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  const handleSendEmailLink = async () =>  {
    setSuccess(false)
    setLoading(true)
    try {
      const res = await api.post(`/auth/admin/reset-password/${email}`)
      const resetLink = res.data.message
      setMessage(res.data.message)
      Cookies.set("resetPassword", resetLink, { expires: 5 / (24 * 60) })
    } catch (err) {
      console.log(err)
      setMessage(err.response.data.message)
    } finally {
      setSuccess(true)
      setLoading(false)
    }
  }
  
  const confirmSubmit = async () => {
    await handleSendEmailLink()
    if(!success) {
      handleOpen()
    }
  }


  return (
    <main>
      {success && (
        <Alert
          color="green"
          icon={<AiFillCheckCircle />}
          className="bg-green-50 text-green-900 border-l-4 border-green-500 rounded-none font-medium absolute"
        >
          {message}
      </Alert>
      )}
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Reset Password Link</DialogHeader>
        <DialogBody divider>
          An email containing a reset password link will been sent to your registered email address. Please check your inbox and follow the instructions to reset your password.
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
          <Button variant="gradient" color="green" onClick={confirmSubmit}>
            {loading ? (
              <Spinner className="h-4 w-4"/>
            ) : (<span>Confirm</span>)}
          </Button>
        </DialogFooter>
      </Dialog>
      <div className="container mx-auto h-screen flex items-center justify-center">
        <Card color="transparent" shadow={false}>
          <Typography className="flex justify-center items-center mb-20" variant="h1" color="blue">
            <span><FaBookReader /></span>
          </Typography>
          <Typography variant="h4" color="blue-gray">
            Find your account
          </Typography>
          {error && (
            <Typography
              variant="small"
              className="my-2 bg-red-800 text-white p-2 rounded-sm"
            >
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit} className="mt-4 mb-2 w-80 max-w-screen-lg sm:w-96">
            <div className="mb-4">
              <Input variant="standard" size="lg" label="Email" id="email" autoComplete="on" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <Button type="submit" className="mt-6 flex justify-center" fullWidth>
              {loading ? (
                <Spinner />
              ) : "Submit"}
            </Button>
          </form>
          {loading ? (
            ""
          ): (
            Object.keys(info).length !== 0 && (
              <div className="my-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className=""
                >
                  Result Account
                </Typography>
                <Button onClick={handleOpen} type="button" variant="outlined" fullWidth className="mt-2">
                  {info && info.maskedInfo && (
                    <Typography>
                      {info.maskedInfo.name}
                    </Typography>
                  )}
                </Button>
              </div>
            )
          )}
          <Link
            to="/login"
            className="font-medium text-blue-gray-800 transition-colors hover:text-blue-700 mt-2"
          >
            Go back
          </Link>
        </Card>
      </div>
    </main>
  )
}

export default ResetPassword