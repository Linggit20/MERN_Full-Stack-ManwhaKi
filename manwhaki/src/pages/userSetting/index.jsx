import { useCallback, useEffect, useState } from "react"
import { Button, Card, CardBody, Checkbox, Input, Spinner, Tooltip, Typography } from "@material-tailwind/react"
import { FaUserPen, FaUserLock } from "react-icons/fa6"
import { AiFillInfoCircle } from "react-icons/ai"
import api from "../../lib/api"
import useHandleErrors from "../../hooks/useHandleError"
import usePageTitle from "../../hooks/usePageTitle"
import Footer from "../../components/Footer"
import { validateInputs } from "../../utils/validation"
import useAuth from "../../hooks/useAuth"

const UserSettings = () => {
  const savedUser = JSON.parse(localStorage.getItem("user"))
  const [username, setUsername] = useState(savedUser.username)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccesMsg] = useState(null)
  const { errors, setError, clearErrors } = useHandleErrors()
  usePageTitle("ManwhaKi - Settings")

  const { state, dispatch } = useAuth()


  // Clear success message in 3s
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccesMsg(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [successMsg])

  // Event handlers for input changes
  const handleCurrentPasswordChange = useCallback((e) => {
    setCurrentPassword(e.target.value)
    clearErrors()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleNewPasswordChange = useCallback((e) => {
    setNewPassword(e.target.value)
    clearErrors()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleConfirmPasswordChange = useCallback((e) => {
    setConfirmPassword(e.target.value)
    clearErrors()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleCheckboxChange = (e) => {
    setShowPassword(e.target.checked)
  }


  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // New password validation
      if (newPassword) {
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
      }

      // Prepare payload for API request
      let payload = {
        username: "",
        currentPassword: currentPassword,
        newPassword: newPassword
      }

      // Check if username is being updated
      if (username !== savedUser.username) {
        payload.username = username
      } 

      // Perform API request to update user information    
      const res = await api.put("/auth/user/update", payload)

      // Update state and local storage on successful update
      setSuccesMsg(res.data)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      if (username !== savedUser.username) {
        const updatedUser = { ...savedUser, username: username }
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }

      dispatch({
        type: "SET_MESSAGE",
        payload: {
          ...state,
          message: res.data
        }
      })
    } catch (err) {
      if (err.response && err.response.data) {
        // Handle API error responses
        if (err.response.status === 400 ) {
          setError.currentPasswordError(err.response.data.error)
        }
      } 

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="layout">
      <div className="flex flex-col justify-between h-screen">
        <main>
          <div className="container lg:px-4">
            <Card shadow={false} className="bg-50 rounded-none lg:rounded-md">
              <CardBody className="px-0">
                <Typography variant="h1" color="blue" className="text-2xl border-b pb-4 border-blue-gray-600 px-4 mb-4">
                  Account Settings
                </Typography>
                <form onSubmit={handleSubmit}>
                  <div className="md:flex gap-4 md:border-b border-blue-gray-900 md:mb-6">
                    <div className="lg:w-[40%]">
                      <Typography className="text-gray-200 px-4 mb-6">
                        Edit Account Information
                      </Typography>
                     <div className="flex gap-4 px-4 pb-8 mb-8">
                      <span className="w-10 text-3xl text-gray-200"><FaUserPen /></span>
                      <div className="flex-1">
                        <div className="mb-5">
                          <span className="text-[11px] text-blue-gray-400">Email</span>
                          <Typography className="text-gray-400 border-b border-dashed border-blue-gray-900 py-1">
                            {savedUser.email}
                          </Typography>
                        </div>
                        <Input
                          className="text-gray-300"
                          variant="standard"
                          label="Username"
                          value={username}
                          onChange={e => setUsername(e.target.value)}
                        />
                      </div>
                    </div>
                    </div>
                    <div className="w-full lg:flex-1">
                      <Typography className="text-gray-200 px-4 mb-6">
                        Change Password
                      </Typography>
                      <div className="flex gap-4 px-4 border-b pb-8 border-blue-gray-900 md:border-none mb-5 md:mb-0">
                        <span className="w-10 text-3xl text-gray-200"><FaUserLock /></span>
                        <div className="flex-1">
                          <div className="flex-1 flex-col space-y-6">
                            <div>
                              <Input
                                className="text-gray-300"
                                type={showPassword ? "text" : "password"} 
                                variant="standard"
                                label="Current Password"
                                value={currentPassword}
                                onChange={handleCurrentPasswordChange}
                                error={errors.currentPasswordError && true}
                                autoComplete="off"
                              />
                              { errors.currentPasswordError && (
                                <Typography className="text-[12px] mt-1 text-red-500">{errors.currentPasswordError}</Typography>
                              )}
                            </div>
                            <div>
                              <div className="relative">
                                <Input
                                  className="text-gray-300"
                                  type={showPassword ? "text" : "password"} 
                                  variant="standard"
                                  label="New Password"
                                  value={newPassword}
                                  onChange={handleNewPasswordChange}
                                  error={errors.newPasswordError && true}
                                  autoComplete="off"                          
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
                                <Typography className="text-[12px] mt-1 text-red-500">{errors.newPasswordError}</Typography>
                              )}
                            </div>
                            <div>
                              <Input
                                className="text-gray-300"
                                type={showPassword ? "text" : "password"} 
                                variant="standard"
                                label="Confirm Password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                error={errors.confirmPasswordError && true}
                                autoComplete="off"                       
                              />
                              { errors.confirmPasswordError && (
                                  <Typography className="text-[12px] mt-1 text-red-500">{errors.confirmPasswordError}</Typography>
                              )}
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end px-4 md:justify-center">
                    <Button
                      className={`shadow-none hover:shadow-none ${loading && "flex justify-center"}`}
                      size="sm"
                      type="submit"
                      disabled={
                        loading ||
                        (savedUser?.username === username &&
                          currentPassword === "" &&
                          newPassword === "")
                      } 
                    >
                      { loading ? ( <Spinner className="w-4 h-4"/> ) : "Save" }
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </div>
  )
}

export default UserSettings