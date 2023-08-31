import { useState } from "react"
import { Card, Input, Button, Typography, Tooltip, Alert, Spinner } from "@material-tailwind/react"
import { Link, useNavigate } from "react-router-dom"
import { AiOutlineEyeInvisible, AiOutlineEye, AiFillCheckCircle  } from "react-icons/ai"
import { FaBookReader } from "react-icons/fa"
import Cookies from "js-cookie"
import api from "../../lib/api"
import usePageTitle from "../../hooks/usePageTitle"
import useAuth from "../../hooks/useAuth"

const Login = () => {
  const [passType, setPassType] = useState("password")
  const registrationSuccess = Cookies.get("registrationSuccess")
  const [email, setEmail] = useState("demo.manwhaki@gmail.com")
  const [password, setPasssword] = useState("3ky5THKY")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  usePageTitle("ManwhaKi - Login")

  const { setAuth } = useAuth()

  const togglePass = () => {
    setPassType(prevType => prevType === "password" ? "text" : "password")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post("/auth/admin/login", {
        email: email,
        password: password,
      })

      const user = res.data.user
      localStorage.setItem("currentUser", JSON.stringify(user))
      setAuth(res.data)
      navigate("/")
    } catch (err) {
      setError(err.response.data.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      {registrationSuccess && (
        <Alert
          color="green"
          icon={<AiFillCheckCircle />}
          className="bg-green-50 text-green-900 border-l-4 border-green-500 rounded-none font-medium absolute"
        >
          {registrationSuccess}
        </Alert>
      )}
      <div className="container mx-auto h-screen flex items-center justify-center">
        <Card color="transparent" shadow={false}>
          <Typography className="flex justify-center items-center mb-20" variant="h1" color="blue">
            <span><FaBookReader /></span>
          </Typography>
          <Typography variant="h5" color="blue-gray" className="mb-2">
            Welcome Back!
          </Typography>
          {error &&
            (
              <Typography
                className="bg-red-600 p-1 text-white rounded-sm"
                variant="small"
              >
                {error}
              </Typography>
            )
          }
          <form onSubmit={handleSubmit} className="mt-4 mb-2 w-80 max-w-screen-lg sm:w-96">
            <div className="mb-4 flex flex-col gap-6">
              <Input size="lg" label="Email" id="email" autoComplete="on" required value={email} onChange={e => setEmail(e.target.value)} />
              <div className="relative">
                <Input type={passType} size="lg" label="Password" id="password" autoComplete="off" required value={password} onChange={e => setPasssword(e.target.value)} />
                <Tooltip
                  className="bg-gray-800"
                  content={
                    <Typography
                      className="text-[12px]"
                    >
                     {passType === "password" ? "Show Password" : "Hide Password"}
                    </Typography>
                  }
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0, y: 25 },
                  }}
                >
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-10 flex items-center justify-center rounded-md hover:bg-opacity-20 hover:bg-gray-400 cursor-pointer" onClick={togglePass}>
                    {passType === "password" ? ( <AiOutlineEyeInvisible /> ) : ( <AiOutlineEye /> )}
                  </span>
                </Tooltip>
              </div>
            </div>
            <Link to="/find-account" className="transition-colors hover:text-blue-700">Forgot Password</Link>
            <Button type="submit" className="mt-6 flex justify-center" fullWidth >
              {loading ? (
                <Spinner className="h-5 w-5"/>
              ): "Login"}
            </Button>
            <Typography color="gray" className="mt-4 text-center font-normal">
              Dont have an account yet?{" "}
              <Link
                to="/register"
                className="font-medium text-blue-500 transition-colors hover:text-blue-700"
              >
                Register
              </Link>
            </Typography>
          </form>
        </Card>
      </div>
    </main>
  )
}

export default Login
