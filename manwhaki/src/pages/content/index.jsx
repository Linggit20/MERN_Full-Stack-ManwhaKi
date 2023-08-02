import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Content from '../../components/Content'
import ScrollTopButton from '../../components/ScrollTopButton'
import { useLocation, useParams } from 'react-router-dom'
import usePageTitle from '../../hooks/usePageTitle'
import Cookies from 'js-cookie'

const MainContent = () => {
  const location = useLocation()
  const  { chapterSlug } = useParams()
  const transformSlug = chapterSlug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
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
        <div className="container lg:p-4">
          <Content />
        </div>
      </main>
      <Footer />
    </>
  )
}

export default MainContent