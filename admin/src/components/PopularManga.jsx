import { Typography, Card, CardBody, Spinner } from "@material-tailwind/react"
import React, { useEffect, useState } from "react"
import { HiOutlineExternalLink } from "react-icons/hi"
import { useNavigate } from "react-router-dom"
import api from "../lib/api"

const PopularManga = () => {
  const [mangaList, setMangaList] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(()  => {
    const getPopularManga = async () => {
    setLoading(true)
    try{
      const res = await api.get("/views/all")
      const data = res.data.popularManga
      const slice = data.slice(0, 3)
      setMangaList(slice)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }
  getPopularManga()
  }, [])


  return (
    loading ? (
      <div className="h-[167.5px] flex items-center justify-center bg-white rounded-md">
        <Spinner />
      </div>
    ) : (
      <Card className=" text-white bg-blue-400">
        <CardBody className="p-4">
          <div className="flex justify-between mb-3">
            <Typography variant="h5">
              Popular Manga
            </Typography>
            <span  className="text-xl cursor-pointer">
              <HiOutlineExternalLink />
            </span>
          </div>
          <div className={`flex ${loading && "justify-center items-center"}`}>
            { mangaList.length === 0 ? (
                <Typography
                  variant="h5"
                  className="py-7 mb-3 flex-1 text-center"
                >
                  No Data Available
                </Typography>
              ) : (
                <>
                  <div className="w-[80%]">
                    Title
                    <ul>
                      {mangaList !== 0 && mangaList.map((item, index) => {
                        return (
                          <li key={item.manga._id}>
                            <span className="mr-2">{index + 1}.</span>
                            {item.manga.title}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="flex-1 text-right">
                    Views
                    <ul>
                      {mangaList !== 0 && mangaList.map((item) => (
                        <li key={item.manga._id}>
                          {item.mangaView.views}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )
            }
          </div>
        </CardBody>
      </Card>
    )
  )
}

export default PopularManga