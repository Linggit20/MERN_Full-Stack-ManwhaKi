import React, { useEffect, useState } from "react"
import api from "../lib/api"
import { Link, useParams } from "react-router-dom"
import { Button, Input, Typography } from "@material-tailwind/react"
import { BsSortNumericUpAlt, BsSortNumericDown  } from "react-icons/bs"

const MangaChapter = () => {
  const [mangaChapters, setMangaChapters] = useState([])
  const [sortedChapters, setSortedChapters] = useState([])
  const [sortOrder, setSortOrder] = useState("asc")
  const [searchTerm, setSearchTerm] = useState("")
  const { slug } = useParams()

  useEffect(() => {
    const getAllChapter = async () => {
      try {
        const res = await api.get(`/chapter/${slug}/all`)
        setMangaChapters(res.data)
        setSortedChapters(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    getAllChapter()
  }, [slug])

  // Get the first and last chapters
  const lastChapter = mangaChapters.length > 0 ? mangaChapters[0] : null
  const firstChapter = mangaChapters.length > 0 ? mangaChapters[mangaChapters.length - 1] : null

  // Function to handle sorting
  const handleSortChapters = () => {
    const sortedChaptersCopy = [...sortedChapters].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.chapterNum - b.chapterNum
      } else {
        return b.chapterNum - a.chapterNum
      }
    })

    setSortedChapters(sortedChaptersCopy)
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  // Function to handle search
  const handleSearchChapters = (event) => {
    const { value } = event.target
    setSearchTerm(value)
    const filteredChapters = mangaChapters.filter((chapter) =>
      chapter.shortTitle.toLowerCase().includes(value.toLowerCase())
    )
    setSortedChapters(filteredChapters)
  }

  return (
    <div className="bg-50 rounded-md mb-16">
      <div className="flex items-center justify-between p-4 gap-6">
        <Typography color="white" className="font-bold">Chapters</Typography>
        <div className="w-full">
          <div className="flex items-center gap-3">
            <hr className="border-gray-700 w-full"/>
            <span className="cursor-pointer text-white text-xl" onClick={handleSortChapters}>
              {sortOrder === "asc" ? ( <BsSortNumericUpAlt /> ) : ( <BsSortNumericDown /> )}
            </span>
          </div>
        </div>
      </div>
      <div className="px-4">
        <div className="grid grid-cols-2 gap-6 mb-4">
          <Button onClick={() => console.log(firstChapter.slug)} className="shadow-none hover:shadow-none h-16 text-sm capitalize">{firstChapter ? firstChapter.shortTitle : "N/A"}</Button>
          <Button onClick={() => console.log(lastChapter.slug)} className="shadow-none hover:shadow-none h-16 text-sm capitalize">{lastChapter ? lastChapter.shortTitle : "N/A"}</Button>
        </div>
      </div>
      <div className="px-4 mb-4">
        <Input
          label="Search Chapter: Example Chapter 1"
          size="lg"
          className="px-4 text-gray-400 text-sm"
          value={searchTerm}
          onChange={handleSearchChapters}
        />
      </div>
      <ul className="max-h-[370px] overflow-y-scroll x-scroll">
        {sortedChapters.length > 0 ? (
            sortedChapters.map((chapter) => (
              <li key={chapter._id} className="mb-4 px-4">
                <Link onClick={() => console.log(chapter.slug)} className="px-4 py-3 border border-blue-gray-700 block rounded-md text-gray-400 text-sm duration-150 hover:text-blue-500">
                  {chapter.shortTitle}
                </Link>
              </li>
            ))
          ) : (
            <Typography color="white" className="text-center my-4 mb-8">
              No chapters found.
            </Typography>
          )}
      </ul>
    </div>
  )
}

export default MangaChapter
