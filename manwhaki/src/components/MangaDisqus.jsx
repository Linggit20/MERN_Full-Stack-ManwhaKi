import React, { useEffect } from "react"
import { Typography } from "@material-tailwind/react"
import { DiscussionEmbed } from "disqus-react"
import { useParams } from "react-router-dom"

const MangaDisqus = () => {
  const {slug} = useParams()


  return (
    <div className="bg-50 rounded-md">
      <div>
        <Typography color="white" className="font-bold border-b border-blue-gray-700 pb-4 mb-10 p-4">
          Comments
        </Typography>
      </div>
      <DiscussionEmbed
          className="p-4 text-blue-500"
          shortname="manhwaki"
          config={{
              url: `http://localhost:5173/series${slug}`,
              identifier: slug,
              title: slug,
              language: "en"
          }}
      />
    </div>
  )
}


export default MangaDisqus