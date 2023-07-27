import { Card, CardBody, Spinner, Typography } from "@material-tailwind/react"
import { useEffect, useState } from "react"
import api from "../lib/api"
import format from "date-fns/format"

const UserInfo = () => {
  const [users, setUser] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      setLoading(true)
      try{ 
        const res = await api.get("/users/all")
        setUser(res.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  return (
    <>
      {loading ? (
        <div className="h-[167.5px] flex items-center justify-center bg-white rounded-md mb-4">
          <Spinner />
        </div>
      ) : (
        <Card className="mb-4 bg-teal-400">
          <CardBody className="p-4">
            <Typography variant="h5" color="white" className="mb-2">
              Active Users
            </Typography>
            <Typography variant="h1" color="white" className="flex justify-center items-center mt-7 mb-5">
              {users.length}
            </Typography>
          </CardBody>
        </Card>
      )}
      <Card>
        <CardBody className="p-4">
          <Typography variant="lead" color="blue-gray" className="mb-2 font-semibold">
            Registration Logs
          </Typography>
          <ul className={`px-4 ${loading && "flex justify-center"}`}>
            {loading ? (
              <Spinner />
            ) : (
              users.map((user) => (
                <li key={user.username} className='text-[13px] text-gray-600 py-2 border-b'>
                  <Typography  variant="small">
                    New manga fan incoming! {user.username} joined on {format(new Date(user.createdAt), "MMMM dd, yyyy")}. Let the manga journey commence!
                  </Typography>
                </li>
              ))
            )}
          </ul>
        </CardBody>
      </Card>
    </>
  )
}

export default UserInfo