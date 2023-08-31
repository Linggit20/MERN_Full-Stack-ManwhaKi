/* eslint-disable react/prop-types */
import { useState } from "react"
import { Alert, Button, Card, CardBody, Checkbox, Input, Spinner, Textarea, Typography } from "@material-tailwind/react"
import { InformationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/solid"
import { useLocation } from "react-router-dom"
import useApi from "../hooks/useApi"


const genres = ["Action", "Adaption", "Adult", "Adventure", "Another chance", "Apocalypse", "Comedy", "Coming Soon", "Cultivation", "Cute", "Demon", "Discord", "Drama", "Dungeons", "Ecchi", "Fantasy", "Game", "Genius", "Genius MC", "Harem", "Hero", "Historical", "Isekai", "Kool Kids", "Magic", "Martial Arts", "Mature", "Mecha", "Modern Setting", "Monsters", "Murim", "Mystery", "Necromancer", "Noble", "Overpowered", "Pets", "Post-Apocalyptic", "Psychological", "Rebirth", "Regression", "Reincarnation", "Return", "Returned", "Returner", "Revenge", "Romance", "School Life", "Sci-fi", "Seinen", "Shoujo", "Shounen", "Sports", "Slice of Life", "Super Hero", "Superhero", "Supernatural", "Survival", "Suspense", "System", "Thriller", "Time Travel", "Time Travel (Future)", "Tower", "Tragedy", "Video Game", "Villain", "Virtual Game", "Virtual Reality", "Virtual World", "Webtoon", "Wuxia",]


const UploadManga = ({ edit, selectedManga, setUpdated }) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(true)
  const location = useLocation()
  const api = useApi()

  // Edit-related states
  // eslint-disable-next-line no-unused-vars
  const [isEdit, setIsEdit] = useState(edit)

  // Form data states
  const [formData, setFormData] = useState({
    title: edit ? selectedManga.title : "",
    slug: edit ? selectedManga.slug: "",
    coverURL: edit ? selectedManga.coverURL : "",
    author: edit ? selectedManga.author : "",
    synopsis: edit ? selectedManga.synopsis : "",
    genre: edit ? selectedManga.genre : [],
    type: edit ? selectedManga.type : "Manwha",
    status: edit ? selectedManga.status : "Ongoing",
    released: edit ? selectedManga.released : "",
  })

  const mangaActive = location.pathname === "/manga"


  const handleScrollToTop = () =>  {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }


  const handleGenreChange = (e) => {
    const { value, checked } = e.target
    setFormData((prevFormData) => {
      if (checked) {
        return {
          ...prevFormData,
          genre: [...prevFormData.genre, value],
        }
      } else {
        return {
          ...prevFormData,
          genre: prevFormData.genre.filter((genre) => genre !== value),
        }
      }
    })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setOpen(true)
    setSuccess(false)
    if (mangaActive) {
      setUpdated(false)
    }

    try {
      if (isEdit) {
        const res = await api.put(`/update/manga/${selectedManga._id}`, formData)
        setSuccessMsg(res.data)
        if (mangaActive) {
          setUpdated(true)
        }
      } else {
        const res = await api.post("/upload/manga", formData)
        setSuccessMsg(res.data)
      }
      setFormData({
        title: "",
        slug: "",
        coverURL: "",
        author: "",
        synopsis: "",
        genre: [],
        type: "Manwha",
        status: "Ongoing",
        released: "",
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response.data.error)
    } finally {
      setLoading(false)
    }
  }


  return (
    <Card className="relative">
      <CardBody className="p-4">
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
        {success && (
          <Alert 
            icon={<CheckCircleIcon className="mt-px h-6 w-6" />}
            className="fixed top-0 left-0 rounded-none z-50"
            color="green"
            open={open}
            variant="gradient"
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
            {successMsg}
          </Alert>
        )}
        <Typography
          variant="h4"
          color="blue"
          className="mb-8"
        >
          {edit ? "Edit Manga" : "Upload Manga Here"}
        </Typography>
        <form  onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex flex-col gap-8 lg:w-[40%]">
              <Input
                variant="outlined"
                size="lg"
                label="Title"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                autoComplete="off"
                required
              />
              <div>
                <Input
                  variant="outlined"
                  size="lg"
                  label="Slug"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  autoComplete="off"
                  required
                />
                <Typography variant="small" color="gray" className="flex items-center gap-1 font-normal mt-2">
                  <InformationCircleIcon className="w-4 h-4 -mt-px" />
                  Example Slug: solo-leveling
                </Typography>
              </div>
              <Input
                variant="outlined"
                size="lg"
                label="Author"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                autoComplete="off"
              />
              <Input
                variant="outlined"
                size="lg"
                label="CoverURL"
                id="coverURL"
                name="coverURL"
                value={formData.coverURL}
                onChange={handleInputChange}
                autoComplete="off"
                required
              />
              <Input
                variant="outlined"
                size="lg"
                label="Type"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                autoComplete="off"
                required
              />
              <Input
                variant="outlined"
                size="lg"
                label="Status"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                autoComplete="off"
              />
              <Input
                variant="outlined"
                size="lg"
                label="Released"
                id="released"
                name="released"
                value={formData.released}
                onChange={handleInputChange}
                autoComplete="off"  
              />
              <Textarea
                className="max-h-72 min-h-[18rem]"
                size="lg"
                resize={true}
                label="Synopsis"
                id="synopsis"
                name="synopsis"
                value={formData.synopsis}
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
            <div className="lg:flex-1">
              <Typography
                className="mb-2"
              >
                Genre
              </Typography>
              <ul className="grid grid-cols-2 2xl:grid-cols-4 gap-4">
                {genres.map((genre) => (
                  <li key={genre}>
                    <Checkbox
    
                      color="blue"
                      label={genre}
                      id={genre}
                      value={genre}
                      checked={formData.genre.includes(genre)}
                      onChange={handleGenreChange}
                      autoComplete="off"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Button onClick={handleScrollToTop} type="submit" className="flex items-center justify-center" fullWidth>
            {loading ? (
              <Spinner />
            ) : edit ? "Submit" : "Upload Manga"}
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}

export default UploadManga