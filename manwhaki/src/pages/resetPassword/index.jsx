import { useCallback, useState } from "react"
import { Card, Input,  Checkbox, Button, Typography, Spinner, Tooltip } from "@material-tailwind/react"
import { useLocation, useNavigate } from "react-router-dom"
import { AiFillInfoCircle } from "react-icons/ai"
import { validateInputs } from "../../utils/validation"
import Cookies from "js-cookie"
import api from "../../lib/api"
import useHandleErrors from "../../hooks/useHandleError"
import usePageTitle from "../../hooks/usePageTitle"
import Footer from "../../components/Footer"
import useGlobalError from "../../hooks/useGlobalError"
import useAuth from "../../hooks/useAuth"

const ResetPassword = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const id = queryParams.get("id")
  const token = queryParams.get("token")

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { errors, setError, clearErrors } = useHandleErrors()
  usePageTitle("ManwhaKi - Reset Password")

  const { setGlobalError } = useGlobalError()
  const { dispatch } = useAuth()


  // Event handlers for input changes
  const handlePasswordChange = useCallback((e) => {
    setNewPassword(e.target.value)
    clearErrors()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleConfirmPasswordChange = useCallback((e) => {
    setConfirmPassword(e.target.value)
    clearErrors()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCheckboxChange = (e) => {
    setShowPassword(e.target.checked)
  }

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setGlobalError(null)

    try {
      // Validate password
      const  isValid = validateInputs([
        {
          value: newPassword,
          validator: (value) => value && value.length >= 8,
          errorSetter: setError.newPasswordError,
          errorMessage: "Password must be at least 8 characters."
        },
        {
          value: confirmPassword,
          validator: (value) => newPassword && value === newPassword,
          errorSetter: setError.confirmPasswordError,
          errorMessage: "Password do not match."
        },
      ])

      if (!isValid) return

      // Call API for user reset password
      const res = await api.post(`auth/reset-password/${id}/${token}`, {
        newPassword
      })

      // Remove cookie and set success message
      Cookies.remove("resetToken")
      dispatch({
        type: "SET_MESSAGE",
        payload: {
          accessToken: "",
          user: "",
          message: res.data.message
        }
      })

      // Navigate to homepage
      navigate("/login")
    } catch (err) {
      // Handle API error responses
      if (err.response && err.response.data) {
        setError.error(err.response.data.error)
      } else {
        // Handle network errors or unexpected errors
        setGlobalError("Network error occurred. Please try again later")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main>
        <div className="container flex items-center justify-center h-[75vh]">
          <Card color="transparent" shadow={false}>
            <Typography variant="h1" color="blue" className="text-3xl">
              Reset Password
            </Typography>
            <Typography className="mt-1 font-normal text-gray-300">
              Enter your new password.
            </Typography>
            <form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
              <div className="mb-4 flex flex-col gap-6">
                <div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"} 
                      size="lg" 
                      required 
                      autoComplete="Off" 
                      label="New Password" 
                      className="text-gray-300"
                      value={newPassword}
                      onChange={handlePasswordChange}
                      error={errors.newPasswordError && true}
                    />
                    <Tooltip
                      className="bg-gray-800 z-[99999]"
                      content={
                        <Typography className="text-[12px]">
                          Password must be at least 8 characters.
                        </Typography>
                      }
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                      }}
                    >
                      <span className=" text-gray-300 absolute right-0 top-1/2 -translate-y-1/2 h-full w-10 flex items-center justify-center rounded-md hover:bg-opacity-10 hover:bg-gray-600 cursor-pointer">
                        <AiFillInfoCircle />
                      </span>
                    </Tooltip>
                  </div>
                    { errors.newPasswordError && (
                      <Typography className="text-[12px] text-red-500 mt-1">
                        { errors.newPasswordError }
                      </Typography>
                    ) }
                </div>
                <div>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    size="lg" required autoComplete="Off"
                    label="Re-enter Password"
                    className="text-gray-300"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    error={errors.confirmPasswordError && true}
                  />
                  { errors.confirmPasswordError && (
                    <Typography className="text-[12px] text-red-500 mt-1">
                      { errors.confirmPasswordError }
                    </Typography>
                  ) }
                </div>
              </div>
              <Checkbox
                checked={showPassword}
                onChange={handleCheckboxChange}
                label={
                  <Typography
                    variant="small"
                    className="flex items-center font-normal text-gray-300"
                  >
                    Show Password
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
              />
              <Button type="submit" className={`mt-6 capitalize font-normal shadow-none hover:shadow-none ${loading && "flex justify-center"}`} fullWidth>
                { loading  ? (
                  <Spinner className="w-4 h-4"/>
                ) : "Confirm" }
              </Button>
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

export default ResetPassword


        // if (!newPassword || newPassword.length < 8) {
      //   setError.newPasswordError("Password must be at least 8 characters.")
      //   return
      // }

      // if(confirmPassword !== password) {
      //   setError.confirmPasswordError("Password do not match")
      //   return
      // }