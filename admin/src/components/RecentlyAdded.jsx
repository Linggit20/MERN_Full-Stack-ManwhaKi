import React from "react"
import useGetManga from "../hooks/useGetManga"
import { format } from "date-fns"
import { Typography, Card, CardBody, Spinner } from "@material-tailwind/react"
import { Link } from "react-router-dom"

const RecentlyAdded = () => {
  const { manga, loading, error } = useGetManga()
  const slicedManga = manga.slice(0, 10)

  return (
    <Card>
      <div className="border-b flex justify-between items-center">
        <Typography
          variant="h5"
          color="blue-gray"
          className="p-4"
        >
          Recently Added
        </Typography>
        <Link to="/manga" className="p-4">
          View all
        </Link>
      </div>
      <CardBody>
        <div className={`${loading ? "flex justify-center items-center" : "grid grid-cols-1 gap-4 px-2"}`}>
          {loading ? (
            <Spinner />
          ) : (
            slicedManga.map((mangaItem) => (
              <div key={mangaItem._id} className="border-b px-4 py-1 md:flex md:justify-between md:gap-4">
                <div className="flex mb-3">
                  <div className="flex-shrink-0">
                    <img src={mangaItem.coverURL} alt={mangaItem.title} className="w-16 h-20 rounded-md" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium">{mangaItem.title}</h2>
                    <div className="flex mt-1">
                      <p className="text-sm text-gray-500 mr-2">{mangaItem.bookmarkCount} {mangaItem.bookmarkCount === 0 ? "Bookmark" : "Bookmarks"}</p>
                      <p className="text-sm text-gray-500">{mangaItem.views} {mangaItem.views === 0 ? "View" : "Views"}</p>
                    </div>
                  </div>
                </div>
                <span className="text-sm hidden md:inline-block">{format(new Date(mangaItem.createdAt), "MMMM dd, yyyy")}</span>
              </div>
            ))
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export default RecentlyAdded