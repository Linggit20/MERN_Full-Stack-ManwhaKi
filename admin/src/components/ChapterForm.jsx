/* eslint-disable react/prop-types */
import { Button, Card, CardBody, Input, Spinner, Typography } from '@material-tailwind/react'
import { useLocation } from 'react-router-dom'

const ChapterForm = ({ chapterData, setChapterData, handleInputChange, handleContentURLChange, handleSubmit, isLoading }) => {
  const location = useLocation()
  const activeAllChapter = location.pathname === "/manga/chapter"

  return (
    <Card>
      <CardBody>
        {activeAllChapter && 
          <Typography variant="h5" color="blue" className="mb-6">Edit Chapter</Typography>
        }
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-8 mb-4">
            <div>
              <Input
                type="text"
                id="fullTitle"
                name="fullTitle"
                label="Full Title"
                size="lg"
                value={chapterData.fullTitle}
                onChange={handleInputChange}
              />
              <Typography variant="small" color="gray" className="flex items-center gap-1 font-normal mt-2">
                Example Full Title: Solo Leveling Chapter 2
              </Typography>
            </div>
            <div>
              <Input
                type="text"
                id="slug"
                name="slug"
                label="Slug"
                size="lg"
                value={chapterData.slug}
                onChange={handleInputChange}
              />
              <Typography variant="small" color="gray" className="flex items-center gap-1 font-normal mt-2">
                Example Slug: solo-leveling-chapter-2
              </Typography>
            </div>
            <div>
              <Input
                type="text"
                id="shortTitle"
                name="shortTitle"
                label="Short Title"
                size="lg"
                value={chapterData.shortTitle}
                onChange={handleInputChange}
              />
              <Typography variant="small" color="gray" className="flex items-center gap-1 font-normal mt-2">
                Example Short Title: Chapter 2
              </Typography>
            </div>
            <div>
              <Input
                type="number"
                id="chapterNum"
                name="chapterNum"
                label="Chapter Number"
                size="lg"
                value={chapterData.chapterNum}
                onChange={handleInputChange}
              />
              <Typography variant="small" color="gray" className="flex items-center gap-1 font-normal mt-2">
                Example Chapter Num: 2
              </Typography>
            </div>
            <div>
              <Input
                type="text"
                id="prevSlug"
                name="prevSlug"
                label="Previous Slug"
                size="lg"
                value={chapterData.chapterNav.prevSlug}
                onChange={(e) => handleInputChange({ target: { name: "chapterNav", value: { ...chapterData.chapterNav, prevSlug: e.target.value } } })}
              />
              <Typography variant="small" color="gray" className="flex items-center gap-1 font-normal mt-2">
                Example Prev Slug: solo-leveling-chapter-1
              </Typography>
            </div>
            <div>
              <Input
                type="text"
                id="nextSlug"
                name="nextSlug"
                label="Next Slug"
                size="lg"
                value={chapterData.chapterNav.nextSlug}
                onChange={(e) => handleInputChange({ target: { name: "chapterNav", value: { ...chapterData.chapterNav, nextSlug: e.target.value } } })}
              />
              <Typography variant="small" color="gray" className="flex items-center gap-1 font-normal mt-2">
                Example Next Slug: solo-leveling-chapter-3
              </Typography>
            </div>
          </div>
          <div className="mb-6">
            <label className="block font-medium mb-1">Content URLs</label>
            {chapterData.contentURL.map((url, index) => (
              <input
                key={index}
                type="text"
                value={url}
                onChange={(e) => handleContentURLChange(e, index)}
                className="px-3 py-2 border rounded w-full outline-none focus:border-sky-200 mb-2"
                placeholder="Enter a content URL"
              />
            ))}
            <button
              type="button"
              onClick={() => setChapterData((prevData) => ({ ...prevData, contentURL: [...prevData.contentURL, ""] }))}
              className="text-blue-500 hover:underline"
            >
              Add URL
            </button>
          </div>
          <Button size="lg" type="submit" fullWidth className="flex justify-center">
            {isLoading ? (
              <Spinner />
            ) : activeAllChapter ? "Update Chapter" : "Upload Chapter"}
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}

export default ChapterForm