import { BsSortNumericUpAlt } from "react-icons/bs"
import { FaBookReader } from "react-icons/fa"

// Loading component for featured
export const FeaturedLoading = () => {
  return (
    <div className="h-[256px] mb-8 bg-50 rounded-md p-2 overflow-hidden">
      <div className="bg-blue-gray-900 w-full hfull h-[240px] rounded-md p-4 relative">
        <div className="absolute bottom-3 w-full animate-pulse">
          <div className="flex items-center justify-center gap-2">
            <span className="bg-100 rounded-full h-1 w-6"></span>
            <span className="bg-100 rounded-full h-1 w-6"></span>
            <span className="bg-100 rounded-full h-1 w-6"></span>
          </div>
        </div>
        <div className="flex justify-between animate-pulse">
          <div className="flex-1">
            <div className="bg-100 w-[80%] h-10 rounded-lg mb-8"></div>
            <div className="bg-100 w-[60%] h-6 rounded-lg mb-2"></div>
            <div className="bg-100 w-[60%] h-6 rounded-lg mb-8"></div>
            <div className="bg-100 w-[25%] h-4 rounded-lg mb-2"></div>
            <div className="bg-100 w-[25%] h-4 rounded-lg mb-2"></div>
          </div>
          <div className="bg-100 rounded-md h-[96px] w-[64px] sm:h-48 sm:w-32"></div>
        </div>
      </div>
    </div>
  )
}

// Loading component for recommended
export const RecommendedLoading = () => {
  return (
    <div className="pb-6 max-w-full flex gap-4 overflow-x-scroll 2xl:overflow-hidden">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="min-w-[10rem] lg:min-w-[11rem] bg-blue-gray-900 p-3 rounded-md">
          <div className="animate-pulse">
            <div className="h-44 bg-100 mb-4 rounded-md"></div>
            <div className="h-6 rounded-md bg-100"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Loading component for the recent update section
export const RecentUpdateLoading = () => {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {[...Array(16)].map((_, index) => (
        <div key={index + 1} className="bg-blue-gray-900 p-4 rounded-md flex gap-5 animate-pulse">
          <div className="w-[120px] h-[160px] bg-50 rounded-md"></div>
          <div className="flex-1">
            <div className="bg-50 h-6 rounded-md mb-9"></div>
              {[...Array(3)].map((_, subIndex) => (
                <div key={subIndex} className="bg-50 h-3 mb-4 rounded-md"></div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
} 

//  Loading component for MangaInfo
export const MangaInfoLoading = () => {
  return (
    <>
      <div className="h-[30vh] w-full blur-3xl bg-gray-700"></div>
      <div className="flex flex-col gap-4 justify-center relative bottom-36 md:justify-start md:flex-row">
        <div className="w-72 self-center md:self-start">
          <div className="bg-blue-gray-900 p-2 rounded-md mb-6">
            <div className="bg-50 rounded-md animate-pulse w-[270px] h-[360px] md:w-[200px] md:h-[264px]"></div>
          </div>
          <div className="capitalize bg-blue-500 rounded-md text-center py-2 text-white text-sm">Bookmark</div>
        </div>
        <div className=" w-full">
          <div className="bg-blue-gray-900 p-4 rounded-md text-white text-sm mb-12">
            <div className="h-[27px] bg-50 rounded-md mb-6 w-7/12 animate-pulse"></div>
              <span className="text-base mb-2 block">Synopsis</span>
              <div className="mb-10">
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="bg-50 h-[20px]  rounded-md mb-2 animate-pulse"></div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <div>Status</div>
                  <div className="h-[15px] bg-50 rounded-md w-[90px] animate-pulse"></div>
                </div>
                <div>
                  <div>Type</div>
                  <div className="h-[15px] bg-50 rounded-md w-[90px] animate-pulse"></div>
                </div>
                <div>
                  <div>Released</div>
                  <div className="h-[15px] bg-50 rounded-md w-[90px] animate-pulse"></div>
                </div>
                <div>
                  <div>Author</div>
                  <div className="h-[15px] bg-50 rounded-md w-[90px] animate-pulse"></div>
                </div>
                <div>
                  <div>Posted On</div>
                  <div className="h-[15px] bg-50 rounded-md w-[90px] animate-pulse"></div>
                </div>
                <div>
                  <div>Updated On</div>
                  <div className="h-[15px] bg-50 rounded-md w-[90px] animate-pulse"></div>
                </div>
              </div>
          </div>
          {  MangaChapterLoading() }
        </div>
      </div>
    </>
  )
}

//  Loading component for MangaChapter
export const MangaChapterLoading = () => {
  return (
    <div className="bg-blue-gray-900 rounded-md mb-16">
      <div className="flex items-center justify-between p-4 gap-6">
        <p className="font-bold text-gray-200">Chapters</p>
        <div className="w-full">
          <div className="flex items-center gap-3">
            <hr className="border-gray-700 w-full"/>
            <button className="bg-transparent shadow-none hover:shadow-none  p-0 text-white text-xl">
              <BsSortNumericUpAlt />
            </button>
          </div>
        </div>
      </div>
      <div className="px-4">
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div className="h-[64px] bg-50 rounded-md animate-pulse"></div>
          <div className="h-[64px] bg-50 rounded-md animate-pulse"></div>
        </div>
      </div>
      <div className="px-4 mb-4 pb-4">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-[46px] bg-50 rounded-md mb-3 animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}


export const ChapterContentLoading = () => {
  return (
    <div className="mb-6">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="h-96 flex justify-center items-center  bg-blue-gray-900">
          <span className="text-7xl text-gray-300 animate-pulse"><FaBookReader /></span>
        </div>
      ))}
    </div>
  )
}
