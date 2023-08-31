import { useEffect, useState } from 'react'
import { Alert, Button, Card, CardBody, CardHeader, Spinner, Typography } from '@material-tailwind/react'
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import useApi from '../hooks/useApi'

const Recommended = () => {
  const [recommendManga, setRecommendedManga] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const api = useApi()


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
        const res = await api.get("/recommend/all")
        setRecommendedManga(res.data.recommendedManga)
      } catch (err) {
        setError(err.response.data.error)
      } finally {
        setLoading(false)
      }
    }

    getRecommendManga()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


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
              // eslint-disable-next-line no-undef
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
        <div className='h-[388.5px] bg-white rounded-md flex justify-center items-center'>
          <Spinner />
        </div>
      ) : (
        recommendManga.length === 0 ? (
          <Card>
            <CardBody>
              <Typography variant="h5" color="blue-gray">
                No Recommended data available
              </Typography>
            </CardBody>
          </Card>
        ) : (
          <Card className='grid place-items-center'>
            <div className='border-b place-self-start w-full'>
              <Typography variant="h5" color="blue-gray" className="p-4">
                Recommended
              </Typography>
            </div>
            <CardBody className=' p-4 pb-6 max-w-full flex gap-4 overflow-x-auto'>
              {recommendManga.map((manga) => (
                <Card key={manga._id} className="mt-6 min-w-[10rem] lg:min-w-[11rem]">
                  <CardHeader color="blue-gray" className="relative h-44">
                    <img
                      src={manga.coverURL}
                      alt="card-image"
                      className='h-full w-full  object-center'
                    />
                  </CardHeader>
                  <CardBody className="p-4">
                    <Typography variant="h5" color="blue-gray" className="mb-2 text-base">
                      {manga.title.length > 28 ? 
                        `${manga.title.slice(0, 28)}${manga.title.length > 20 ? "..." : ""}` 
                        : manga.title}
                    </Typography>
                  </CardBody>
                </Card>
              ))}
            </CardBody>
          </Card>
        )
      )}
    </>
  )
}

export default Recommended