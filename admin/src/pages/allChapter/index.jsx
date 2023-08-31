import AllChapter from '../../components/AllChapter'
import usePageTitle from '../../hooks/usePageTitle'

const ChapterList = () => {
  usePageTitle("ManwhaKi - All Chapter")

  return (
    <div className="bg-gray-100 text-blue-gray-800 p-4 rounded-md">
      <AllChapter />
    </div>
  )
}

export default ChapterList