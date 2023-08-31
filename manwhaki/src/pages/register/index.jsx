import { useCallback, useState } from "react"
import { Card, Input,  Button, Typography, Tooltip, Spinner } from "@material-tailwind/react"
import { Link, useNavigate } from "react-router-dom"
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai"
import { validateInputs } from "../../utils/validation"
import api from "../../lib/api"
import useHandleErrors from "../../hooks/useHandleError"
import usePageTitle from "../../hooks/usePageTitle"
import Footer from "../../components/Footer"
import ErrorMessage from "../../components/error/ErrorMessage"
import useAuth from "../../hooks/useAuth"

const Register = () => {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [passType, setPassType] = useState("password")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { errors, setError, clearErrors } = useHandleErrors()
  usePageTitle("Register")

  const { dispatch } = useAuth()


  // Toggle password visibility
  const togglePass = () => setPassType((prevType) => (prevType === "password" ? "text" : "password"))

  // Event handlers for input changes
  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value)
    clearErrors()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value)
    clearErrors()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value)
    clearErrors()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // Validate email format
  const emailIsValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Helper function to set errors
  const setErrorAndReturn = (error, errorSetter) => {
    errorSetter(error)
    return false
  }

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError.error(null)
    
    try {
       // Validate email and password
      const  isValid = validateInputs([
        {
          value: email,
          validator: emailIsValid,
          errorSetter: setError.emailError,
          errorMessage: "Please enter a valid email address"
        },
        {
          value: password,
          validator: (value) => value && value.length >= 8,
          errorSetter: setError.passwordError,
          errorMessage: "Password must be at least 8 characters"
        },
      ])

      if (!isValid) return

      // Call API for user registration
      const res = await api.post("auth/user/register", {
        email,
        username,
        password,
      })

      // Reset form and set user data
      setEmail("")
      setUsername("")
      setPassword("")

      dispatch({ type: "REGISTER", payload: res.data})
      localStorage.setItem("user", JSON.stringify(res.data.user))
      // Navigate to home page
      navigate("/")
    } catch (err) {
      // Handle API error response
      if (err.response && err.response.data) {
        switch (err.response.data.error) {
          case "Username is already taken":
            setErrorAndReturn(err.response.data.error, setError.usernameError)
            break
          case "Email is already taken":
            setErrorAndReturn(err.response.data.error, setError.emailError)
            break
          case "Please enter a valid email address":
            setErrorAndReturn(err.response.data.error, setError.emailError)
            break
          case "Password must be at least 8 characters long":
            setErrorAndReturn(err.response.data.error, setError.passwordError)
            break
          default:
            setErrorAndReturn("Network error occurred. Please try again later", setError.error)
        }
      } else {
        // Handle network errors or unexpected errors
        setError.error("Network error occurred. Please try again later")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ErrorMessage message={errors.error} />
      <main>
        <div className="container flex items-center justify-center h-[75vh]">
          <Card color="transparent" shadow={false} className="text-gray-300">
            <Typography variant="h1" color="blue" className="text-3xl">
              Register
            </Typography>
            <Typography className="mt-1 font-normal">
              Enter your details to register
            </Typography>
            <form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
              <div className="mb-4 flex flex-col gap-6">
                <div>
                  <Input
                    className="text-gray-400"
                    size="lg"
                    label="Email"
                    name="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    autoComplete="off"
                    autoFocus
                    error={errors.emailError && true}
                  />
                  {errors.emailError && (
                    <Typography className="text-sm mt-1 text-red-500">{errors.emailError}</Typography>
                  )}
                </div>
                <div>
                  <Input
                    className="text-gray-400"
                    size="lg"
                    label="Username"
                    name="username"
                    required                 
                    value={username}
                    onChange={handleUsernameChange}
                    autoComplete="off"
                    error={errors.usernameError && true}
                  />
                  {errors.usernameError && (
                    <Typography className="text-sm mt-1 text-red-500">{errors.usernameError}</Typography>
                  )}
                </div>
                <div>
                  <div className="relative">
                    <Input
                      className="text-gray-400"
                      type={passType}
                      size="lg"
                      label="Password"
                      name="password"
                      required                   
                      value={password}
                      onChange={handlePasswordChange}
                      autoComplete="off"
                      error={errors.passwordError && true}                  
                    />
                    <Tooltip
                      className="bg-gray-800 z-[99999]"
                      content={
                        <Typography className="text-[12px]">
                          {passType === "password" ? "Show Password" : "Hide Password"}
                        </Typography>
                      }
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                      }}
                      >
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-10 flex items-center justify-center rounded-md hover:bg-opacity-10 hover:bg-gray-600 cursor-pointer" onClick={togglePass}>
                          {passType === "password" ? ( <AiOutlineEyeInvisible /> ) : ( <AiOutlineEye /> )}
                        </span>
                    </Tooltip>
                  </div>
                  {errors.passwordError && (
                    <Typography className="text-sm mt-1 text-red-500">{errors.passwordError}</Typography>
                  )}
                </div>
              </div>
              <Button type="submit" className={`mt-6 shadow-none hover:shadow-none ${loading && "flex justify-center"}`} fullWidth>
                { loading ? ( <Spinner className="w-4 h-4" /> ) : "Register" }
              </Button>
              <Typography className="mt-4 text-center font-normal text-sm">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-blue-500 transition-colors hover:text-blue-700">
                  Login
                </Link>
              </Typography>
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

export default Register