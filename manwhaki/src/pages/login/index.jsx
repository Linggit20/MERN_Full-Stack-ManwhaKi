import { useCallback, useState } from "react"
import { Card, Input, Button, Typography, Tooltip, Spinner } from "@material-tailwind/react"
import { Link, useNavigate } from "react-router-dom"
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai"
import api from "../../lib/api"
import useHandleErrors from "../../hooks/useHandleError"
import usePageTitle from "../../hooks/usePageTitle"
import Footer from "../../components/Footer"
import useAuth from "../../hooks/useAuth"
import useGlobalError from "../../hooks/useGlobalError"


const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [passType,  setPassType] = useState("password")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { errors, setError, clearErrors } = useHandleErrors()
  usePageTitle("Login")

  const { dispatch } = useAuth()
  const { setGlobalError } = useGlobalError()

  // Toggle password visibility
  const togglePass = () => setPassType((prevType) => (prevType === "password" ? "text" : "password"))

  // Event handlers for input changes
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


  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError.error(null)

    try {
      // Call API for user login
      const res = await api.post("/auth/user/login", {
        username,
        password,
      })

      // Reset form and set user data
      setUsername("")
      setPassword("")

      dispatch({type: "LOGIN", payload: res.data})
      localStorage.setItem("user", JSON.stringify(res.data.user))

      // Navigate to home page
      navigate("/")
    } catch (err) {
      // Handle API error responses      
      if (err.response && err.response.data) {
        setError.loginError(err.response.data.error)
      } else  {
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
          <Card color="transparent" shadow={false} className="text-gray-300">
            <Typography variant="h1" color="blue" className="text-3xl">
              Login
            </Typography>
            <Typography className="mt-1 font-normal">
              Enter your details to login
            </Typography>
            { errors.loginError && (
              <Typography className="mt-5 text-sm bg-red-500 text-white px-3 py-1 rounded-sm">
                { errors.loginError }
              </Typography>
            )}
            <form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
              <div className="mb-4 flex flex-col gap-6">
                <Input
                  className="text-gray-300"
                  size="lg"
                  label="Username"
                  name="username"
                  required                  
                  value={username}
                  onChange={handleUsernameChange}
                  autoComplete="off"
                  autoFocus
                />
                <div className="relative">
                  <Input
                    className="text-gray-300"
                    type={passType}
                    size="lg"
                    label="Password"
                    name="password"
                    required                    
                    value={password}
                    onChange={handlePasswordChange}
                    autoComplete="off"                  
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
                <Link to="/find-account" className="text-gray-300 duration-150 hover:text-blue-500">Forgot password</Link>
              </div>
              <Button type="submit" className={`mt-6 shadow-none hover:shadow-none ${loading && "flex justify-center"}`} fullWidth>
                { loading ? ( <Spinner className="w-4 h-4" /> ) : "Login" }
              </Button>
              <Typography className="mt-4 text-center font-normal text-sm">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-blue-500 transition-colors hover:text-blue-700">
                  Register
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

export default Login