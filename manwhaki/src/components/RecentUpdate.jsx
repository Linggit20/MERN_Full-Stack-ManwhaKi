import React, { useEffect, useRef, useState } from "react"
import { Typography, Tabs, TabsHeader, TabsBody, Tab, TabPanel, Button } from "@material-tailwind/react"
import { formatDistanceToNow } from 'date-fns'
import api from "../lib/api"
import { Link, useLocation, useNavigate } from "react-router-dom"

const RecentUpdate = ({ cookie }) => {
  const [activeTab, setActiveTab] = useState("all")
  const [manga,  setManga] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasNextPage, setHasNextPage] = useState(null)
  const recentUpdateRef = useRef(null)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const pagesParam = searchParams.get("page") || 1
  const [page, setPage] = useState(pagesParam)

  
  useEffect(() => {
    const getRecentUpdate = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/manga/recent/all?page=${pagesParam}`)
        setHasNextPage(res.data.hasNextPage)
        setManga(res.data.latestUpdate)
      } catch (err) {
        setError(err.response.data.error)
      } finally {
        setLoading(false)
      }
    }

    getRecentUpdate()
  }, [pagesParam])


  useEffect(() => {
    const pagesParam = searchParams.get("page") || 1
    setPage(pagesParam)
  }, [searchParams])


  useEffect(() => {
    scrollToRecentUpdate()
  }, [page])

  const scrollToRecentUpdate = () => {
    if (recentUpdateRef.current) {
      recentUpdateRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Functions to navigate between pages
  const navigate = useNavigate()
  const next = () => {
    if (hasNextPage) {
      setPage((prevPage) => prevPage + 1)
      const searchParams = new URLSearchParams(location.search)
      searchParams.set("page", String(page + 1))
      navigate({ search: searchParams.toString() })
    }
  }

  const prev = () => {
    if (page !== 1) {
      setPage((prevPage) => prevPage - 1)
      const searchParams = new URLSearchParams(location.search)
      searchParams.set("page", String(page - 1))
      navigate({ search: null })
    }
  }

  return (
    <div ref={recentUpdateRef}>
      <Typography className="text-lg font-bold text-white px-4 mb-4">
        Latest Update
      </Typography>
      <div className="bg-50 p-4">
        <Tabs value={activeTab} className="">
          <div className="flex items-center">
            <TabsHeader
              className="bg-transparent text-blue-500 px-0"
              indicatorProps={{
                className: "bg-transparent shadow-none",
              }}
            >
                <Tab onClick={() => setActiveTab("all")} value="all" className={`${activeTab === "all" ? "text-blue-500" : "text-white"} mr-4`}>
                  All
                </Tab>
                <Tab onClick={() => setActiveTab("bookmarks")} value="bookmarks" className={`${activeTab === "bookmarks" ? "text-blue-500" : "text-white"} ${cookie ? "block" : "hidden"}`}>
                  Bookmarks
                </Tab>
            </TabsHeader>
            <hr className="border-gray-700 w-full"/>
          </div>
          <TabsBody
            animate={{
            initial: { y: 250 },
            mount: { y: 0 },
            unmount: { y: 250 },
          }}
          >
          <TabPanel value="all" className="px-0">
            {loading ? (
              <div className="grid md:grid-cols-2 gap-5">
                {[...Array(16)].map((_, index) => (
                  <div key={index + 1} className="bg-blue-gray-900 p-4 rounded-md flex gap-5 animate-pulse">
                    <div className="w-[120px] h-[160px] bg-50 rounded-md"></div>
                      <div className="flex-1">
                        <div className="bg-50 h-6 rounded-md mb-9"></div>
                          {[...Array(3)].map((_, subIndex) => (
                            <div key={subIndex} className="bg-50 h-3 mb-4 rounded-md"></div>
                          ))}
                      </div>
                  </div>
                ))}
              </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2">
                    {manga.map((mangaItem) => (
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
                            {mangaItem.chapters.map((chapter) => (
                              <li key={chapter._id} className="mb-2 rounded-md  py-1 text-[12px] flex items-center justify-between">
                                <Link to={`/${mangaItem.manga.slug}/${chapter.slug}`} className="cursor-pointer text-gray-400 transition-colors duration-150 hover:text-gray-200">{chapter.shortTitle}</Link>
                                <span>{formatDistanceToNow(new Date(chapter.createdAt), {addSuffix: true})}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <Button onClick={prev} disabled={page === 1} size="sm" className={`shadow-none hover:shadow-none capitalize`}>Prev</Button>
                    <Button onClick={next} disabled={hasNextPage === false} size="sm" className={`shadow-none hover:shadow-none capitalize`}>Next</Button>
                  </div>
                </>
              )}
          </TabPanel>
          <TabPanel value="bookmarks">
            bookmark
          </TabPanel>
          </TabsBody>
        </Tabs>
      </div>
    </div>
  )
}

export default RecentUpdate