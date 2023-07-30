import React, { useEffect, useRef, useState } from "react"
import { Alert, Button, Card, CardBody, CardHeader, IconButton, Typography } from "@material-tailwind/react"
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import { BsChevronRight, BsChevronLeft } from "react-icons/bs"
import api from "../lib/api"
import { useNavigate } from "react-router-dom"

const Recommended = () => {
  const [recommendManga, setRecommendedManga] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  const handleScrollLeft = () => {
    const container = containerRef.current
    const scrollAmount = -575
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    })
  }

  const handleScrollRight = () => {
    const container = containerRef.current
    const scrollAmount = 575
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [error])

  useEffect(() => {
    const getRecommendManga = async () => {
      setLoading(true)
      try {
        const res = await api.get("/recommend")
        setRecommendedManga(res.data.recommendedManga)
      } catch (err) {
        setError(err.response.data.error)
      } finally {
        setLoading(false)
      }
    }

    getRecommendManga()
  }, [])

  const handleSlug = (mangaSlug, chapterSlug) => {
    const storedSlugs = JSON.parse(localStorage.getItem("selectedSlugs")) || {};
    storedSlugs[mangaSlug] = chapterSlug;
    localStorage.setItem("selectedSlugs", JSON.stringify(storedSlugs));
  }
  return (
    <>
      {error && (
        <Alert
          variant="gradient"
          color="red"
          icon={<ExclamationTriangleIcon className="h-6 w-6" />}
          open={open}
          className="fixed top-0 left-0 z-50"
          action={
            <Button
              variant="text"
              color="white"
              size="sm"
              className="!absolute top-3 right-3"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      <Card className="grid place-items-center rounded-none bg-50 mb-8 relative">
        <div className={`${loading ? "hidden" : "absolute top-[45%] w-full hidden lg:block"}`}>
          <div className="flex justify-between items-center w-full px-6">
            <IconButton onClick={handleScrollLeft} className=" bg-blue-500 bg-opacity-70 text-xl z-10">
              <span><BsChevronLeft /></span>
            </IconButton>
            <IconButton onClick={handleScrollRight} className=" bg-blue-500 bg-opacity-70 text-xl z-10">
              <span><BsChevronRight /></span>
            </IconButton>
          </div>
        </div>
        <div className="place-self-start w-full flex items-center gap 4">
          <Typography variant="h5" color="white" className="p-4 text-base">
            Recommended
          </Typography>
          <hr className="border-gray-700 w-full mr-4"/>
        </div>
        <CardBody ref={containerRef} className="p-4 pb-6 max-w-full flex gap-4 overflow-x-scroll x-scroll 2xl:overflow-hidden">
          {loading ? (
            Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="mt-6 min-w-[10rem] lg:min-w-[11rem] bg-blue-gray-900 p-3 rounded-md">
                <div className="animate-pulse">
                  <div className="h-44 bg-100 mb-4 rounded-md"></div>
                  <div className="h-6 rounded-md bg-100"></div>
                </div>
              </div>
            ))
          ) : (
            recommendManga.map((manga) => (
              <Card key={manga._id} onClick={() => (handleSlug("mangaSlug", manga.slug), navigate(`/series/${manga.slug}`))} shadow={false} className="mt-6 min-w-[10rem] lg:min-w-[11rem] bg-50 group cursor-pointer">
                <CardHeader shadow={false} color="blue-gray" className="relative h-44">
                  <img
                    src={manga.coverURL}
                    alt="card-image"
                    className="h-full w-full object-center"
                  />
                </CardHeader>
                <CardBody className="p-4">
                  <Typography color="white" size="sm" className="mb-2 font-medium group-hover:text-blue-500 transition-colors duration-150">
                    {manga.title.length > 28 ? 
                      `${manga.title.slice(0, 28)}${manga.title.length > 28 ? "..." : ""}` 
                      : manga.title}
                  </Typography>
                </CardBody>
              </Card>
            ))
          )}
        </CardBody>
      </Card>
    </>
  )
}

export default Recommended

