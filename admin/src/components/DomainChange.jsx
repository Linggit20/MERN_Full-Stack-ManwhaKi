import { Button, Card, CardBody, Input, Spinner, Typography } from "@material-tailwind/react"
import useApi from "../hooks/useApi"
import { useState } from "react"


// eslint-disable-next-line react/prop-types
const DomainChange = ({ selectedManga, getMangaChapters }) => {
  const [newDomain, setNewDomain] = useState("")
  const [oldDomain, setOldDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const api = useApi()

  // eslint-disable-next-line react/prop-types
  const mangaId = selectedManga._id


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    

    try {
      const res = await api.put(`/content/domain/${mangaId}`, {
        newDomain,
        oldDomain
      })

      console.log(res)
      setNewDomain("")
      setOldDomain("")
      getMangaChapters(mangaId)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-4">
      <CardBody>
        <Typography className="mb-4">Change contentURL Domain</Typography>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            <Input
              size="lg"
              label="Old Domain"
              autoComplete="on"
              value={oldDomain}
              required
              onChange={(e) => setOldDomain(e.target.value)}
            />
            <Input
              size="lg"
              label="New Domain"
              autoComplete="on"
              value={newDomain}
              required
              onChange={(e) => setNewDomain(e.target.value)}
            />
          </div>
          <Button type="submit" className={`shadow-none ${loading && "flex justify-center"}`}>
            { loading ? (
              <Spinner className="h-4 w-4"/>
            ) : "Confirm"}
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}

export default DomainChange