import React, { useState } from "react"
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import Cookies from "js-cookie";

const ResetPassword = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const id = queryParams.get("id")
  const token = queryParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()


c
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(confirmPassword !== password) {
      setError("Password do not match")
      return
    }

    try {
      const res = await api.post(`auth/reset-password/${id}/${token}`, {
        newPassword: password
      })
      Cookies.remove("resetToken")
      Cookies.set("registrationSuccess", res.data.message, { expires: 1 / 86400 })
      navigate("/")
      console.log(res)
    } catch (err) {
      console.log(err)
      setError(err.response.data.error)
    }
  }


  return (
    <>
      <Navbar />
      <main>
        <div className="container flex items-center justify-center h-[75vh] text-white">
          <Card color="transparent" shadow={false}>
            <Typography variant="h4" color="white">
              Reset Password
            </Typography>
            <Typography className="mt-1 font-normal text-gray-300">
              Enter your new password.
            </Typography>
            <form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
              <div className="mb-4 flex flex-col gap-6">
                <Input
                  type={showPassword ? "text" : "password"} 
                  size="lg" 
                  required 
                  autoComplete="Off" 
                  label="New Password" 
                  className="text-white"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  size="lg" required autoComplete="Off"
                  label="Re-enter Password"
                  className="text-white"
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
              <Button type="submit" className="mt-6 capitalize font-normal shadow-none hover:shadow-none" fullWidth>
                Confirm
              </Button>
            </form>
          </Card>
        </div>
      </main>
      <div className="fixed bottom-0 w-full">
        <Footer />
      </div>
    </>
  )
}

export default ResetPassword