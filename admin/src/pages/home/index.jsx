import TotalManga from "../../components/TotalManga"
import PopularManga from "../../components/PopularManga"
import RecentlyAdded from "../../components/RecentlyAdded"
import UserInfo from "../../components/UserInfo"
import FeaturedManga from "../../components/FeaturedManga"
import Recommended from "../../components/Recommended"
import usePageTitle from "../../hooks/usePageTitle"

const Home = () => {
  usePageTitle("ManwhaKi - Home")

  return (
    <div className="bg-gray-100 text-blue-gray-800 p-4 rounded-lg 2xl:flex gap-6">
      <div className="flex-1 mb-4">
        <FeaturedManga />
        <div className="md:flex gap-6 mb-4">
          <div className="mb-4 md:mb-0 md:w-1/2 2xl:w-[30%]">
            <TotalManga />
          </div>
          <div className="md:w-1/2 2xl:flex-1">
            <PopularManga />
          </div>
        </div>
        <div className="mb-4">
          <Recommended />
        </div>
        <div>
          <RecentlyAdded />
        </div>
      </div>
      <div className="2xl:w-72">
        <UserInfo />
      </div>
    </div>
  )
}

export default Home