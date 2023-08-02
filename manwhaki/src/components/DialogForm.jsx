import { useEffect, useState } from 'react'
import { Button, Dialog, Card, CardHeader, CardBody, CardFooter, Typography, Input, Spinner, Tooltip } from "@material-tailwind/react"
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai"
import api from '../lib/api'
import FindAccount from './FindAccount'
import { set } from 'date-fns'

const DialogForm = ({setMessage, login, setLogin , openForm, setOpenForm, setCookie}) => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [passType,  setPassType] = useState("password")
  const [forgotPassword, setForgotPassword]  = useState(false)

  const togglePass = () => setPassType((prevType) => (prevType === "password" ? "text" : "password"))

  // set the default to login when form is closed
  useEffect(() => {
    if (!openForm) {
      setLogin(true)
      setForgotPassword(false)
    }
  }, [openForm])


  useEffect(() => {
    if (!login) {
      setUsername("")
      setPassword("")
      setEmail("")
    }
  }, [login])

 // Function to handle form submission (login or register)
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let payload = {
        username: username,
        password: password,
      }

      if (!login) {
        payload.email = email
      }

      const url = login ? "/auth/user/login" : "auth/user/register"
      const res = await api.post(url, payload)
      console.log(res)
      setCookie(true)
      setMessage(res.data.message)
      setOpenForm(false)
      setEmail("")
      setUsername("")
      setPassword("")
      localStorage.setItem("user", JSON.stringify(res.data.info))
    } catch (err) {
      setError(err.response.data.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Dialog
        size="xs"
        open={openForm}
        handler={() => setOpenForm((cur) =>!cur)}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem] bg-50">
          <CardHeader
            shadow={false}
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            {forgotPassword ? (
              <Typography variant="h3" color="white">Find  Account</Typography>
            ) : (
              <Typography variant="h3" color="white">
                {login ? "Sign In" : "Register"}
              </Typography>
            )}
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            {forgotPassword ? (
              <FindAccount setMessage={setMessage} setOpenForm={setOpenForm}/>
            ) : (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                {error && (
                  <span className="text-white bg-red-400 rounded-md py-1 px-4">{error}</span>
                )}
                <Input
                  className="text-white"
                  label="Username"
                  size="lg"
                  type="text"
                  required
                  autoComplete="On"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
                {!login && (
                  <Input
                    className="text-white"
                    label="Email"
                    size="lg"
                    type="text"
                    required
                    autoComplete="On"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                )}
                <div className="relative">
                  <Input
                    className="text-white"
                    label="Password"
                    size="lg"
                    required
                    type={passType}
                    autoComplete="Off"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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
                <Typography onClick={() => setForgotPassword(true)} className="text-gray-500 text-sm duration-150 hover:text-blue-500 cursor-pointer">Forgot Password</Typography>
                <Button type="submit" variant="gradient" fullWidth className={`${loading && "flex justify-center"} capitalize font-normal shadow-none hover:shadow-none`}>
                  {loading ? (
                    <Spinner className="w-4 h-4"/>
                  ) : (
                    login ? "Sign In" : "Register"
                  )}
                </Button>
              </form>
            )}
          </CardBody>
          <CardFooter className="pt-0">
            {forgotPassword ? (
              <span onClick={() => setForgotPassword(false)} className="text-gray-400 cursor-pointer duration-150 hover:text-blue-500">Go back</span>
            ) : (
              <Typography variant="small" className="mt-6 flex justify-center">
                {login ? (
                  <>
                    Don't have an account?
                    <span
                      variant="small"
                      color="blue"
                      className="ml-1 font-bold text-blue-500 cursor-pointer"
                      onClick={() => (setLogin(false), setError(null))}
                    >
                      Sign up
                    </span>
                  </>
                ) : (
                  <>
                    Already have an account?
                    <span
                      variant="small"
                      color="blue"
                      className="ml-1 font-bold text-blue-500 cursor-pointer"
                      onClick={() => (setLogin(true), setError(null))}
                    >
                      Sign In
                    </span>
                  </>
                )}
              </Typography>
            )}
          </CardFooter>
        </Card>
      </Dialog>
    </div>
  )
}

export default DialogForm