import { useState } from "react"
import { Card, Input,  Button, Typography, Tooltip, Spinner, } from "@material-tailwind/react"
import { Link, useNavigate } from "react-router-dom"
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai"
import { FaBookReader } from "react-icons/fa"
import api from "../../lib/api"
import { CgDanger } from "react-icons/cg"
import Cookies from "js-cookie"
import usePageTitle from "../../hooks/usePageTitle"


const Register = () => {
  const [passType, setPassType] = useState("password")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [nameError, setNameError] = useState(null)
  const navigate = useNavigate()
  usePageTitle("ManwhaKi - Create Account")


  const togglePass = () => {
    setPassType(prevType => prevType === "password" ? "text" : "password")
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const namePattern = /^[a-zA-Z\s]+$/

    try {
      if (!emailPattern.test(email)) {
        setError("Invalid email address")
        setLoading(false)
        return
      }

      if (!namePattern.test(name)) {
        setNameError("Invalid name. Name should only contain letters and spaces.")
        setLoading(false)
        return
      }

      const res = await api.post("/auth/admin/register", {
        name: name,
        email: email,
        password: password,
      })

      Cookies.set("registrationSuccess", res.data, { expires: 1 / 86400 })
      navigate("/login")
    } catch (err) {

      setError(err.response.data.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <div className="container mx-auto h-screen flex items-center justify-center">
        <Card color="transparent" shadow={false}>
          <Typography className="flex justify-center items-center mb-20" variant="h1" color="blue">
            <span><FaBookReader /></span>
          </Typography>
          <Typography variant="h4" color="blue-gray">
            Sign Up
          </Typography>
          <Typography color="gray" className="mt-1 mb-2 font-normal">
            Enter your details to register.
          </Typography>
          {error || nameError ?
            (
              <Typography
                className="bg-red-600 p-1 text-white rounded-sm"
                variant="small"
              >
                {error || nameError}
              </Typography>
            ) : null
          }
          <form onSubmit={handleSubmit} className="mt-4 mb-2 w-80 max-w-screen-lg sm:w-96">
            <div className="mb-4 flex flex-col gap-6">
              <Input
                size="lg" 
                label="Name" 
                id="name" 
                autoComplete="on" 
                required value={name} 
                onChange={e => setName(e.target.value)}
                error={nameError ? true : false}
              />
              <div className="relative">
                <Input
                  size="lg"
                  label="Email"
                  id="email"
                  autoComplete="on"
                  required value={email}
                  onChange={e => setEmail(e.target.value)}
                  error={error && true}
                />
                {error && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-800">
                  <CgDanger />
                </span>
                )}
              </div>
              <div className="relative">
                <Input type={passType} size="lg" label="Password" id="password" autoComplete="off" required value={password} onChange={e => setPassword(e.target.value)} />
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
            <Button type="submit" className="mt-6 flex justify-center" fullWidth >
              {loading ? (
                <Spinner className="h-5 w-5"/>
              ): "Register"}
            </Button>
            <Typography color="gray" className="mt-4 text-center font-normal">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-medium text-blue-500 transition-colors hover:text-blue-700"
              >
                Login
              </Link>
            </Typography>
          </form>
        </Card>
      </div>
    </main>
  )
}

export default Register