import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../lib/api"
import { Button, Spinner, Typography } from "@material-tailwind/react"
import MangaDisqus from "./MangaDisqus"

const Content = () => {
  const { mangaSlug, chapterSlug } = useParams()
  const [chapterData, setChapterData] = useState({})
  const [loading, setLoading] = useState(false)
  const [allChapter, setAllChapter] = useState([])
  const [currentChapter, setCurrentChapter] =  useState("")
  const navigate =  useNavigate()

  useEffect(() => {
    const getContent = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/chapter/${chapterSlug}`)
        setChapterData(res.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    if (chapterSlug) {
      getContent()
    }
  }, [chapterSlug])


  useEffect(() => {
    const  getAllChapter = async () => {
      try {
        const res = await api.get(`/chapter/${mangaSlug}/all`)
        setAllChapter(res.data)
        const currentChapterData = res.data.find((chapter) => chapter.slug === chapterSlug);
        setCurrentChapter(currentChapterData.shortTitle)
      } catch (err) {
        console.log(err)
      }
    }

    getAllChapter()
  }, [mangaSlug, chapterSlug])
    
  const handleNavigateNext = () => {
    navigate(`/${mangaSlug}/${chapterData.chapterNav?.nextSlug}`)
    window.scrollTo({ top: 0, behavior: "smooth"})
  }

  const handleNavigatePrev = () => {
    navigate(`/${mangaSlug}/${chapterData.chapterNav?.prevSlug}`)
    window.scrollTo({ top: 0, behavior: "smooth"})
  }

  return (
    <div className="py-7">
      <div className="text-center px-4 mb-8">
        <Typography variant="h1" color="white" className="text-2xl mb-3">{chapterData.fullTitle ? chapterData.fullTitle : "N/A"}</Typography>
        <Typography color="white" className="text-sm">
          All chapters are in
          <Link to={`/series/${mangaSlug}`} className="ml-1 text-blue-500">
            {mangaSlug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
          </Link>
        </Typography>
      </div>
      <div className="flex justify-between items-center px-4 lg:px-0 mb-4">
        <div>
          <select
            className="bg-50 px-4 py-2 text-[12px] rounded-full text-white cursor-pointer w-36 sm:w-48 focus:outline-none"
            value={currentChapter}
            onChange={(e) => {
              setCurrentChapter(e.target.value);
              const selectedChapter = allChapter.find(
                (chapter) => chapter.shortTitle === e.target.value
              );
              if (selectedChapter) {
                navigate(`/${mangaSlug}/${selectedChapter.slug}`);
              }
            }}
          >
            <optgroup label="Select Chapter">
              {allChapter.map((chapter) => (
                <option
                  key={chapter._id}
                  value={chapter.shortTitle}
                  className="bg-50"
                >
                  {chapter.shortTitle}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button disabled={chapterData.chapterNav?.prevSlug === ""} onClick={handleNavigatePrev} className="rounded-full text-[12px] shadow-none capitalize hover:shadow-none text-white w-14 py-1 flex justify-center font-normal">Prev</Button>
          <Button disabled={chapterData.chapterNav?.nextSlug === ""} onClick={handleNavigateNext} className="rounded-full text-[12px] shadow-none capitalize hover:shadow-none text-white w-14 py-1 flex justify-center font-normal">Next</Button>
        </div>
      </div>
      {loading ? (
        <div className="h-40 flex justify-center items-center my-4">
          <Spinner />
        </div>
      ) : (
        <ul className="flex flex-col items-center mb-6">
          {chapterData.contentURL  && chapterData.contentURL.map((img, index) => (
            <li key={index} className="max-w-[720px]"> 
              <img src={img} alt={`image ${index + 1}`} className="w-full" loading="lazy"/>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-between items-center px-4 lg:px-0 mb-16">
        <div>
          <select
            className="bg-50 px-4 py-2 text-[12px] rounded-full text-white cursor-pointer w-36 sm:w-48 focus:outline-none"
            value={currentChapter}
            onChange={(e) => {
              setCurrentChapter(e.target.value);
              const selectedChapter = allChapter.find(
                (chapter) => chapter.shortTitle === e.target.value
              );
              if (selectedChapter) {
                navigate(`/${mangaSlug}/${selectedChapter.slug}`);
              }
            }}
          >
          <optgroup label="Select Chapter">
            {allChapter.map((chapter) => (
              <option
                key={chapter._id}
                value={chapter.shortTitle}
                className="bg-50"
              >
                {chapter.shortTitle}
              </option>
            ))}
          </optgroup>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button disabled={chapterData.chapterNav?.prevSlug === ""} onClick={handleNavigatePrev} className="rounded-full text-[12px] shadow-none capitalize hover:shadow-none text-white w-14 py-1 flex justify-center font-normal">Prev</Button>
          <Button disabled={chapterData.chapterNav?.nextSlug === ""} onClick={handleNavigateNext} className="rounded-full text-[12px] shadow-none capitalize hover:shadow-none text-white w-14 py-1 flex justify-center font-normal">Next</Button>
        </div>
      </div>
      <MangaDisqus />
    </div>
  )
}

export default Content