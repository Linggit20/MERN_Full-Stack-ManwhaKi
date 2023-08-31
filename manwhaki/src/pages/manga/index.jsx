import { useEffect } from "react"
import { useLocation, useParams } from "react-router-dom"
import usePageTitle from "../../hooks/usePageTitle"
import ScrollTopButton from "../../components/ScrollTopButton"
import MangaInfo from "../../components/mangaPage/MangaInfo"
import Footer from "../../components/Footer"

const Manga = () => {
  const location = useLocation()
  const  { mangaSlug } = useParams()
  const transformMangaSlug = mangaSlug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
  usePageTitle(`${transformMangaSlug} - ManwhaKi`)


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])


  return (
    <>
      <ScrollTopButton />
        <>
          <main>
            <div className="container sm:px-4">
              <MangaInfo />
            </div>
          </main>
          <footer>
            <Footer />
          </footer>
        </>
    </>
  )
}

export default Manga