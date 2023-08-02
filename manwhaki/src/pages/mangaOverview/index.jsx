import React, { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import Navbar from "../../components/Navbar"
import MangaInfo from "../../components/MangaInfo"
import Footer from "../../components/Footer"
import ScrollTopButton from "../../components/ScrollTopButton"
import usePageTitle from "../../hooks/usePageTitle"
import Cookies from "js-cookie"

const MangaOverview = () => {
  const location = useLocation()
  const  { slug } = useParams()
  const transformSlug = slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
  usePageTitle(`${transformSlug} - ManwhaKi`)
  const [cookie, setCookie] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

    // check for the presence of a user cookie
  useEffect(() => {
    const cookies = Cookies.get("accessToken")
    if (cookies) {
      return setCookie(true)
    }
    return setCookie(false)
  }, [cookie])
  return (
    <>
      <Navbar cookie={cookie} setCookie={setCookie}/>
      <ScrollTopButton />
      <main>
        <section>
          <div className="container sm:px-4">
            <MangaInfo />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default MangaOverview