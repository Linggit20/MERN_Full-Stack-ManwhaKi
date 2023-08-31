import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Card, Input, Checkbox, Button, Typography, } from "@material-tailwind/react"
import api from "../../lib/api"
import Cookies from "js-cookie"
import { FaBookReader } from "react-icons/fa"
import usePageTitle from "../../hooks/usePageTitle"

const UpdatePassword = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const id = queryParams.get("id")
  const token = queryParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  usePageTitle("ManwhaKi - Reset Password")


  const handleCheckboxChange = (e) => {
    setShowPassword(e.target.checked)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(confirmPassword !== password) {
      setError("Password do not match")
      return
    }

    try {
      const res = await api.post(`auth/admin/reset-password/${id}/${token}`, {
        newPassword: password
      })
      Cookies.remove("resetPassword")
      Cookies.set("registrationSuccess", res.data.message, { expires: 1 / 86400 })
      navigate("/login")
      console.log(res)
    } catch (err) {
      console.log(err)
      setError(err.response.data.error)
    }
  }

  return (
    <main>
      <div className="container mx-auto h-screen flex justify-center items-center">
        <Card color="transparent" shadow={false}>
          <Typography className="flex justify-center items-center mb-20" variant="h1" color="blue">
            <span><FaBookReader /></span>
          </Typography>
          <Typography variant="h4" color="blue-gray">
            Reset Password
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Enter your new password.
          </Typography>
          {error && (
            <Typography variant="small" className="mt-2 bg-red-800 text-white p-1 rounded-sm">
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit} className="mt-4 mb-2 w-80 max-w-screen-lg sm:w-96">
            <div className="mb-4 flex flex-col gap-6">
              <Input
                type={showPassword ? "text" : "password"}
                size="lg"
                label="Password"
                autoComplete="off"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Input
                type={showPassword ? "text" : "password"}
                size="lg"
                label="Confirm Password"
                autoComplete="off"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                error={error}
              />
            </div>
            <Checkbox
              checked={showPassword}
              onChange={handleCheckboxChange}
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center font-normal"
                >
                  Show Password
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Button type="submit" className="mt-6" fullWidth>
              Reset Password
            </Button>
          </form>
        </Card>
      </div>
    </main>
  )
}

export default UpdatePassword
