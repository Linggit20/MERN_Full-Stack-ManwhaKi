import React, { useEffect, useState } from "react"
import { Typography } from "@material-tailwind/react"
import { CommentCount, DiscussionEmbed } from "disqus-react"
import { useLocation, useParams } from "react-router-dom"

const MangaDisqus = () => {
  const {slug, mangaSlug, chapterSlug} = useParams()
  const [show, setShow]  = useState(false)
  const location = useLocation()

  const url = slug ? `http://localhost:5173/series${slug}` : `http://localhost:5173/series${mangaSlug}/${chapterSlug}`
  const title = slug ? slug : chapterSlug

  useEffect(() => {
    setShow(false)
  } ,[location])

  return (
    <div className="bg-50 rounded-md">
      <div className={`w-full h-[300px] flex  items-center justify-center ${show && "hidden"} px-4`}>
        <div onClick={() => setShow(true)} className="text-center border py-5 px-20 border-dashed cursor-pointer rounded-md">
          <CommentCount
            className="text-gray-200 text-2xl md:text-3xl font-bold"
            shortname='manhwaki'
            config={
              {
                url: url,
                identifier: title,
                title: title,
              }
            }
          >
            comment
          </CommentCount>
          <Typography className="mt-4 text-sm md:text-base text-gray-300 font-bold">
            Click to open comment
          </Typography>
        </div>
      </div>
      {show && (
        <div>
          <div>
            <Typography color="white" className="font-bold border-b border-blue-gray-700 pb-4 mb-10 p-4 ">
              Comments
            </Typography>
          </div>
          <DiscussionEmbed
            className="p-4 text-blue-500"
            shortname="manhwaki"
            config={{
              url: url,
              identifier: title,
              title: title,
              language: "en"
            }}
          />
        </div>
      )}
    </div>
  )
}


export default MangaDisqus