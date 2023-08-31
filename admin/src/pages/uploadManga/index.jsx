import UploadManga from "../../components/UploadManga"
import usePageTitle from "../../hooks/usePageTitle"

const Upload = () => {
  usePageTitle("ManwhaKi - Upload Manga")
  return (
    <div className="bg-gray-100 text-blue-gray-800 p-4 rounded-md">
      <UploadManga />
    </div>
  )
}

export default Upload