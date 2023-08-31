import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardBody, CardHeader, IconButton, Typography } from "@material-tailwind/react"
import { BsChevronRight, BsChevronLeft } from "react-icons/bs"
import { RecommendedLoading } from "../LoadingComponents"
import api from "../../lib/api"
import useGlobalError from "../../hooks/useGlobalError"

const Recommended = () => {
  const [recommendManga, setRecommendedManga] = useState([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef(null)
  const navigate = useNavigate()
  const { globalError, setGlobalError } = useGlobalError()

  useEffect(() => {
    const getRecommendManga = async () => {
      setLoading(true)
      setGlobalError(null)

      try {
        const res = await api.get("/recommend")
        setRecommendedManga(res.data.recommendedManga)
      } catch (err) {
        setGlobalError("Network error occurred. Please try again later")
      } finally {
        setLoading(false)
      }
    }

    getRecommendManga()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  return (
    <>
      <Card className="grid place-items-center rounded-none bg-50 mb-8 relative">
        <div className={`${loading || globalError ? "hidden" : "absolute top-[45%] w-full hidden lg:block"}`}>
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
        <CardBody ref={containerRef} className="p-4 pb-6 max-w-full flex gap-4 overflow-x-scroll scroll 2xl:overflow-hidden">
          { globalError ? (
            <RecommendedLoading />
          ) : (
            <>
              { loading ? (
                <RecommendedLoading />
              ) : (
                recommendManga.map((manga) => (
                  <Card key={manga._id} onClick={() => navigate(`/series/${manga.slug}`)} shadow={false} className="mt-6 min-w-[10rem] lg:min-w-[11rem] bg-50 group cursor-pointer">
                    <CardHeader shadow={false} color="blue-gray" className="relative h-44">
                      <img
                        className="h-full w-full object-center"
                        src={manga.coverURL}
                        alt="card-image"
                        loading="lazy"
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
            </>
          )}
        </CardBody>
      </Card>
    </>
  )
}

export default Recommended

