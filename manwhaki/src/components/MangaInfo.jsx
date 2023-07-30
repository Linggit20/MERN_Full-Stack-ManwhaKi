import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../lib/api"
import { Button, Typography } from "@material-tailwind/react"
import { parseISO, format }from "date-fns"
import MangaChapter from "./MangaChapter"
import MangaDisqus from "./MangaDisqus"

const MangaInfo = () => {
  const { slug } = useParams()
  const [manga, setManga] = useState({})
  const [loading, setLoading] = useState(false)
  let postedOn = "N/A"
  let updatedOn = "N/A"

  if (manga.createdAt) {
    const parsedDate = parseISO(manga.createdAt);
    postedOn = format(parsedDate, "MMMM dd, yyyy");
  }

  if (manga.updatedAt) {
    const parsedDate = parseISO(manga.updatedAt);
    updatedOn = format(parsedDate, "MMMM dd, yyyy");
  }

  useEffect(() => {
    getManga()
  }, [slug])

  const getManga = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/single/${slug}`)
      setManga(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <img src={manga?.coverURL} alt={manga?.title} className="h-[30vh] w-full blur-3xl object-cover object-top"/>
      <div className="flex flex-col gap-4 justify-center relative bottom-36 md:justify-start md:flex-row">
        <div className="w-72 self-center md:self-start">
          <div className="bg-50 p-2 rounded-md mb-6">
            <img src={manga?.coverURL} alt={manga?.title} className="rounded-md"/>
          </div>
          <Button fullWidth className="capitalize shadow-none hover:shadow-none">Bookmark</Button>
        </div>
        <div className=" w-full">
          <div className="bg-50 p-4 rounded-md text-white text-sm mb-12">
            <Typography variant="h5" color="white" className="mb-6">{manga.title ? manga.title : "N/A"}</Typography>
            <span className="text-base mb-2 block">Synopsis</span>
            <Typography className="text-gray-400 mb-10">{manga.synopsis ? manga.synopsis : "N/A"}</Typography>
            <div className="grid grid-cols-2 gap-10">
              <div>
                <Typography>Status</Typography>
                <span className="text-[13px] text-gray-400">{manga?.status}</span>
              </div>
              <div>
                <Typography>Type</Typography>
                <span className="text-[13px] text-gray-400">{manga?.type}</span>
              </div>
              <div>
                <Typography>Released</Typography>
                <span className="text-[13px] text-gray-400">{manga?.released === "" ? "-" : manga?.released}</span>
              </div>
              <div>
                <Typography>Author</Typography>
                <span className="text-[13px] text-gray-400">{manga?.author === "" ? "-" : manga?.author}</span>
              </div>
              <div>
                <Typography>Posted On</Typography>
                <span className="text-[13px] text-gray-400">{postedOn}</span>
              </div>
              <div>
                <Typography>Updated On</Typography>
                <span className="text-[13px] text-gray-400">{updatedOn}</span>
              </div>
            </div>
          </div>
          <MangaChapter/>
          <MangaDisqus />
        </div>
      </div>
    </div>
  )
}

export default MangaInfo
