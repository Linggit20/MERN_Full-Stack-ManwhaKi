import { useEffect, useState } from "react"
import { Alert, Button, Card, CardBody, Carousel, Spinner, Typography } from "@material-tailwind/react"
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import api from "../lib/api"

const FeaturedManga = () => {
  const [featuredManga, setFeaturedManga] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const getFeaturedManga = async () => {
      setLoading(true)
      try {
        const res = await api.get("/featured/all")
        setFeaturedManga(res.data.featuredMangaList)
      } catch (err) {
        console.log(err)
        setError(err.response.data.error)
      } finally {
        setLoading(false)
      }
    }

    getFeaturedManga();

    // Update window width state on window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [])

  // Function to truncate synopsis based on screen width
  const truncateSynopsis = (synopsis) => {
    if (windowWidth < 1460) {
      return synopsis.slice(0, 100) + "...";
    }
    return synopsis.slice(0, 280) + "...";
  };

  return (
    <>
      {error && (
        <Alert
          variant="gradient"
          color="red"
          icon={<ExclamationTriangleIcon className="h-6 w-6" />}
          open={open}
          className='fixed top-0 left-0 z-50'
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
      {loading ? (
        <div className="h-[256px] mb-4 bg-white rounded-md flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        featuredManga.length === 0 ? (
          <Card className="mb-4">
            <CardBody className="p-4">
              <Typography variant="h5" color="blue-gray">
                No Featured Manga
              </Typography>
            </CardBody>
          </Card>
        ) : (
          <Carousel
            className="rounded-xl h-64 mb-4"
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
              <div key={manga._id} className="h-full w-full relative">
                <img
                  src={manga.coverURL}
                  alt={manga.title}
                  className="h-full w-full object-cover object-top filter blur-3xl"
                />
                <div className="absolute inset-0 flex gap-4 bg-black bg-opacity-40 p-4">
                  <div className="flex-1">
                    <div>
                      <div className="mb-3">
                        <Typography className={`text-lg text-white mb-1`} variant="h1">
                          {windowWidth < 650
                            ? `${manga.title.slice(0, 20)}${
                                manga.title.length > 20 ? "..." : ""
                              }`
                            : manga.title
                          }
                        </Typography>
                        {manga.genre.length !== 0 ? (
                          manga.genre.map((item, index) => (
                            <span key={index} className="hidden sm:inline-block mr-2 text-white text-[12px] bg-gray-500 py-1 px-2 rounded-sm">{item}</span>
                          ))
                        ) : (
                          <span>No available genre</span>
                        )}
                      </div>
                      <Typography variant="small" color="white" className={`${windowWidth > 1460 ? "max-w-[900px]" : ""} mb-4`}>
                        <span className="block mb-1 font-semibold">Summary</span>
                        {truncateSynopsis(manga.synopsis)}
                      </Typography>
                      <div>
                        <Typography variant="small" color="white">
                          Author: {manga.author ? manga.author : "-"}
                        </Typography>
                        <Typography variant="small" color="white">
                          Status:  {manga.status}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <div className={`${windowWidth > 1460 ? "w-36  h-48" : "w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 2xl:w-28 2xl:h-32"}`}>
                    <img src={manga.coverURL} alt={manga.title} className="rounded-md object-cover w-full"/>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        )
      )}
    </>
  )
}

export default FeaturedManga;
