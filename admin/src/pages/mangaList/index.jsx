import React from "react"
import MangaList from "../../components/MangaList"
import usePageTitle from "../../hooks/usePageTitle"

const Manga = () => {
  usePageTitle("ManwhaKi - Manga Collection")
  return (
    <div className="bg-gray-100 text-blue-gray-800 p-4 rounded-md">
      <MangaList />
    </div>
  )
}

export default Manga