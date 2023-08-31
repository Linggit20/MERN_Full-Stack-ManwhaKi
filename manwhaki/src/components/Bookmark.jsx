import useGetBookmarks from "../hooks/useGetBookmark"
import { Typography } from "@material-tailwind/react"
import { Link, useLocation } from "react-router-dom"

const Bookmark = () => {
  // eslint-disable-next-line no-unused-vars
  const { bookmarked, loading  } = useGetBookmarks()
  const location = useLocation()

  const activeBookmarks = location.pathname === "/bookmarks"

  if (bookmarked.length === 0) {
    return ( <Typography variant="h1" className ="text-gray-400 text-md">No Bookmark available</Typography> )
  }
  
  return (
    <div className={`bg-50 ${activeBookmarks ? "p-4" : ""}`}>
      <div className="grid md:grid-cols-2">
        {bookmarked.map((mangaItem) => (
          <div key={mangaItem.manga._id} className="flex gap-5 mb-10 border-b pb-10 border-gray-700">
            <div className="w-[120px] h-[160px] rounded-md overflow-hidden">
              <Link to={`/series/${mangaItem.manga.slug}`} className="relative">
                <img src={mangaItem.manga.coverURL} alt={mangaItem.manga.title} loading="lazy" className="h-full w-full rounded-md transition-transform duration-150 hover:scale-105"/>
              </Link>
            </div>
            <div className="flex-1 mr-6 ">
              <Link to={`/series/${mangaItem.manga.slug}`} className="text-white mb-3 block text-sm font-medium transition-colors duration-150 hover:text-blue-500 cursor-pointer">
                {mangaItem.manga.title}
              </Link>
              <ul>
                {mangaItem.manga.chapters !== null ? 
                  mangaItem.manga.chapters.map((chapter) => (
                    <li key={chapter._id} className="mb-2 rounded-md  py-1 text-[12px] flex items-center justify-between">
                      <Link to={`/${mangaItem.manga.slug}/${chapter.slug}`} className="cursor-pointer text-blue-400 transition-colors duration-150 hover:text-gray-200">{chapter.shortTitle}</Link>
                    </li>
                )) : (
                  <Typography className="text-gray-400 text-sm">No read Chapter</Typography>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Bookmark