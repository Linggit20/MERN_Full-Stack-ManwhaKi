import { Button, Card, CardBody, Checkbox, Dialog, Input, Spinner, Typography } from "@material-tailwind/react"
import React, { useEffect, useState } from "react"
import { FaUserPen, FaUserLock } from "react-icons/fa6"
import api from "../lib/api"

const UserSetting = ({ openSettings, setOpenSettings, setMessage }) => {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [notMatch, setNotMatch] = useState(null)
  const savedUser = JSON.parse(localStorage.getItem("user"))

  const handleCheckboxChange = (e) => {
    setShowPassword(e.target.checked)
  }

  useEffect(() => {
    if (savedUser) {
      setEmail(savedUser.email)
      setUsername(savedUser.username)
    }
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (confirmNewPassword !== newPassword) {
      setLoading(false)
      setNotMatch("Password don't match")
      return
    }
    
    try {
      let payload = {
        username: "",
        currentPassword: currentPassword,
        newPassword: newPassword
      }

      if (username !== savedUser.username) {
        payload.username = username
      }

      const res = await api.put("/auth/user/update", payload)

      setMessage(res.data)
      setOpenSettings(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
      if (username !== savedUser.username) {
        const updatedUser = { ...savedUser, username: username }
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }
    } catch (err) {
      setError(err.response.data.error)
    } finally {
      setLoading(false)
    }
  }


  return (
    <Dialog
      size="sm"
      open={openSettings}
      handler={() => setOpenSettings((cur) => !cur)}
      className="bg-transparent shadow-none"
    >
    <Card className="mx-auto w-full max-w-[24rem] bg-50">
      <CardBody className="p-0">
        <form onSubmit={handleSubmit} className="py-5 space-y-4 flex flex-col">
          <Typography color="white" className="text-lg font-bold border-b  border-blue-gray-700 px-4 pb-4">Account Settings</Typography>
          <div className="px-4 mb-6">
            <div className="flex items-center gap-4 px-4 border-b border-blue-gray-700 pb-8">
              <span className="text-gray-200 text-3xl hidden sm:block">
                <FaUserPen />
              </span>
              <div className="w-full">
                <div className="mb-4">
                  <span className="text-[12px] text-blue-500">Email</span>
                  <Typography className="border-b border-dashed border-blue-gray-700 pb-1">{email ? email : "N/A"}</Typography>
                </div>
                <div>
                  <Input
                    className="text-gray-200"
                    variant="standard"
                    label="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="px-4">
            <div className="flex items-center gap-4 px-4 pb-8">
              <span className="text-gray-200 text-3xl hidden sm:block"><FaUserLock /></span>
              <div className="w-full flex flex-col space-y-5">
                <div>
                  <Input
                    className="text-gray-200 w-full"
                    variant="standard"
                    label="Current Password"
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    error={error && true}
                    onChange={e => setCurrentPassword(e.target.value)} 
                  />
                  {error && ( <span className="text-[12px] text-red-400">{error}</span> )}
                </div>
                <Input
                  className="text-gray-200"
                  variant="standard"
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}  
                />
                <div>
                  <Input
                    className="text-gray-200"
                    variant="standard"
                    label="Confirm New Password"
                    type={showPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    error={notMatch &&  true}   
                  />
                  {notMatch && ( <span className="text-[12px] text-red-400">{notMatch}</span>)}
                </div>
                <Checkbox
                checked={showPassword}
                onChange={handleCheckboxChange}
                label={
                  <Typography
                    variant="small"
                    className="flex items-center font-normal text-gray-400"
                  >
                    Show Password
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
              />
              </div>
            </div>
          </div>
          <Button
            disabled={
              loading ||
              (savedUser.username === username &&
                currentPassword === "" &&
                newPassword === "")
            } 
            type="submit" size="sm" className="self-center capitalize px-8 shadow-none hover:shadow-none">
            {loading ? (
              <Spinner className="w-4 h-4"/>
            ) : "Save"}
          </Button>
        </form>
      </CardBody>
      </Card>
    </Dialog>
  )
}

export default UserSetting