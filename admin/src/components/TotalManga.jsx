import useGetManga from "../hooks/useGetManga"
import { Spinner, Typography, Menu, MenuHandler, MenuList, MenuItem, Card, CardBody } from "@material-tailwind/react"
import { BsThreeDots } from "react-icons/bs"
import { useNavigate } from "react-router-dom"

const TotalManga = () => {
  const { manga, loading } = useGetManga()
  const navigate = useNavigate()

  return (
    loading ? (
      <div className="h-[167.5px] flex items-center justify-center bg-white rounded-md">
        <Spinner />
      </div>
    ) : (
      <Card className="bg-deep-orange-400 text-white">
        <CardBody className="p-4">
          <div className="flex justify-between items-center mb-3">
            <Typography variant="h5">
              Total Manga
            </Typography>
            <Menu
              animate={{
                mount: { y: 0 },
                unmount: { y: 25 },
              }}
            >
              <MenuHandler>
                <span className="text-xl cursor-pointer">
                  <BsThreeDots />
                </span>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={() => navigate("/manga")} className="text-center">See all</MenuItem>
              </MenuList>
            </Menu>
          </div>
          <Typography variant="h1" className="flex items-center justify-center mt-7 mb-5">
            {manga.length}
          </Typography>
        </CardBody>
      </Card>
    )
  )
}

export default TotalManga