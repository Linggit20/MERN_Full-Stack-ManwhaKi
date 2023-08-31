import { useEffect } from "react"
import usePageTitle from "../../hooks/usePageTitle"
import Footer from "../../components/Footer"
import Featured from "../../components/homePage/Featured"
import Recommended from "../../components/homePage/Recommended"
import RecentUpdate from "../../components/homePage/RecentUpdate"
import ScrollTopButton from "../../components/ScrollTopButton"

const Home = () => {
  usePageTitle("ManwhaKi - Read Comics")

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <ScrollTopButton />
        <>
          <main>
            <section className="hero-section">
              <div className="container lg:px-4">
                <Featured />
              </div>
            </section>
            <section className="recommended-section">
              <div className="container lg:px-4">
                <Recommended />
              </div>
            </section>
            <section className="recent-update-section">
              <div className="container lg:px-4">
                <RecentUpdate />
              </div>
            </section>
          </main>
          <footer>
            <Footer />
          </footer> 
        </>
    </>
  )
}

export default Home