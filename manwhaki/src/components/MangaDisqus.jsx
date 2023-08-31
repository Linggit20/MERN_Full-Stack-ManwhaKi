import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { Typography } from "@material-tailwind/react"
import { CommentCount, DiscussionEmbed } from "disqus-react"

const MangaDisqus = () => {
  const {mangaSlug: slug, mangaSlug, chapterSlug} = useParams()
  const [show, setShow]  = useState(false)
  const location = useLocation()
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const isActiveManga = location.pathname === `/series/${slug}`
  const isActiveMangaMangaChapter = location.pathname === `/${mangaSlug}/${chapterSlug}`

  useEffect(() => {
    setShow(false)
    if (isActiveManga) {
      setUrl(`http://localhost:5173/series/${slug}`)
      setTitle(slug)
    }
    if (isActiveMangaMangaChapter) {
      setUrl(`http://localhost:5173/${mangaSlug}/${chapterSlug}`)
      setTitle(chapterSlug)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  return (
    <div className="bg-50 rounded-md">
      <div className={`w-full h-[300px] flex  items-center justify-center ${show && "hidden"} px-4`}>
        <div onClick={() => setShow(true)} className="text-center border py-5 px-20 border-dashed cursor-pointer rounded-md border-blue-gray-500">
          <CommentCount
            className="text-gray-200 text-2xl md:text-3xl font-bold"
            shortname={import.meta.env.VITE_DISQUS}
            config={
              {
                url: url,
                identifier: title,
                title: title,
              }
            }
          >
            Comments 
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
            shortname={import.meta.env.VITE_DISQUS}
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