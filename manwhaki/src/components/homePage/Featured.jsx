import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Carousel, Typography } from "@material-tailwind/react"
import { FeaturedLoading } from "../LoadingComponents"
import api from "../../lib/api"
import useGlobalError from "../../hooks/useGlobalError"

const Featured = () => {
  const [featuredManga, setFeaturedManga] = useState([])
  const [loading, setLoading] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const navigate = useNavigate()
  const { globalError, setGlobalError } = useGlobalError()

  useEffect(() => {
    const getFeaturedManga = async () => {
      setLoading(true)
      setGlobalError(null)

      try {
        const res = await api.get("/featured")
        setFeaturedManga(res.data.featuredMangaList)
      } catch (err) {
        setGlobalError("Network error occurred. Please try again later")
      } finally {
        setLoading(false)
      }
    }

    getFeaturedManga()

    // Update window width state on window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Function to truncate synopsis based on screen width
  const truncateSynopsis = (synopsis) => {
    if (windowWidth < 1460) {
      return synopsis.slice(0, 100) + "..."
    }
    return synopsis.slice(0, 250) + "..."
  }

  if (globalError) {
    return (
      <FeaturedLoading />
    )
  }

  return (
    <>
      {loading ? (
        <FeaturedLoading />
      ) : (
        <Carousel
          className="h-64 mb-8"
          autoplay={true}
          loop={true}
          prevArrow={() => (<Button className="hidden">prev</Button>)}
          nextArrow={() => (<Button className="hidden">next</Button>)}
          navigation={({ setActiveIndex, activeIndex, length }) => (
            <div className="absolute bottom-4 left-2/4 z-10 flex -translate-x-2/4 gap-2">
              {new Array(length).fill("").map((_, i) => (
                <span
                  key={i}
                  className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                     activeIndex === i ? "w-8 bg-blue-500" : "w-4 bg-white/50"
                  }`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
          )}
        >
          {featuredManga.map((manga) => (
            <div onClick={() => navigate(`/series/${manga.slug}`)} key={manga._id} className="h-full w-full relative cursor-pointer">
              <img
                className="h-full w-full object-cover object-top filter blur-3xl"
                src={manga.coverURL}
                alt={manga.title}
                loading="lazy"
              />
              <div className="absolute inset-0 flex gap-4 bg-black bg-opacity-40 p-4">
                <div className="flex-1">
                  <div>
                    <div className="mb-3">
                      <Typography className="text-lg text-white mb-1" variant="h1">
                        {windowWidth < 650
                          ? `${manga.title.slice(0, 20)}${
                             manga.title.length > 20 ? "..." : ""
                          }`
                          : manga.title
                        }
                      </Typography>
                      {manga.genre.length !== 0 ? (
                        <div>
                          {manga.genre.slice(0, 3).map((item, index) => (
                            <span
                              key={index}
                              className="inline-block mr-2 text-white text-[12px] bg-gray-700  px-2 rounded-sm mb-1"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span>No available genre</span>
                      )}
                    </div>
                    <Typography color="white" className={`${windowWidth > 1460 ? "max-w-[900px]" : ""} mb-4 text-[12px] sm:text-sm`}>
                      <span className="block mb-1 font-semibold">Summary</span>
                      {truncateSynopsis(manga.synopsis)}
                    </Typography>
                    <div>
                      <Typography color="white" className="text-[12px] sm:text-sm">
                        Author: {manga.author ? manga.author : "-"}
                      </Typography>
                      <Typography color="white" className="text-[12px] sm:text-sm">
                         Status:  {manga.status}
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className={`${windowWidth > 1460 ? "w-36  h-48" : "w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 2xl:w-28 2xl:h-32"}`}>
                  <img src={manga.coverURL} alt={manga.title} className="rounded-md object-cover w-full"  loading="lazy"/>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      )}
    </>
  )
}

export default Featured
