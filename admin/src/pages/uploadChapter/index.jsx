import React from "react"
import UploadChapter from "../../components/UploadChapter"
import usePageTitle from "../../hooks/usePageTitle"

const Chapter = () => {
  usePageTitle("ManwhaKi - Upload Chapter")

  return (
    <div className="bg-gray-100 text-blue-gray-800 p-4 rounded-md">
      <UploadChapter />
    </div>
  )
}

export default Chapter