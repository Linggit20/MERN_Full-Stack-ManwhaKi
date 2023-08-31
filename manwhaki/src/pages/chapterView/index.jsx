import { useEffect } from "react"
import Footer from "../../components/Footer"
import ScrollTopButton from "../../components/ScrollTopButton"
import ChapterView from "../../components/chapterViewPage/ChapterView"
import { useLocation } from "react-router-dom"

const Chapter = () => {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])


  return (
    <>
      <ScrollTopButton />
      <main>
        <div className="container">
          <ChapterView />
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  )
}

export default Chapter