import React, { useEffect, useState } from "react"
import Navbar from "../../components/Navbar"
import Featured from "../../components/Featured"
import Recommended from "../../components/Recommended"
import RecentUpdate from "../../components/RecentUpdate"
import ScrollTopButton from "../../components/ScrollTopButton"
import Footer from "../../components/Footer"
import Cookies from "js-cookie"
import usePageTitle from "../../hooks/usePageTitle"
import { Alert } from "@material-tailwind/react"
import { BsCheckCircleFill } from "react-icons/bs"

const Home = () => {
  const [cookie, setCookie] = useState(false)
  usePageTitle("ManwhaKi - Read Comics")
  const [resetPassSuccess, setResetPassSuccess] = useState(Cookies.get("registrationSuccess"))

  // check for the presence of a user cookie
  useEffect(() => {
    const cookies = Cookies.get("accessToken")
    if (cookies) {
      return setCookie(true)
    }
    return setCookie(false)
  }, [cookie])

  useEffect(() => {
    const timer = setTimeout(() => {
      setResetPassSuccess(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [resetPassSuccess])

  return (
    <>
      {resetPassSuccess && (
        <Alert color="green" icon={<BsCheckCircleFill />}
          className="rounded-none border-l-4 border-[#2ec946] bg-[#2ec946]/10 font-medium text-[#2ec946]"
        >
          {resetPassSuccess ? resetPassSuccess : "N/A"}
        </Alert>
      )}
      <Navbar cookie={cookie} setCookie={setCookie}/>
      <ScrollTopButton />
      <main>
        <section className="hero-section">
          <div className="container lg:px-4">
            <Featured />
          </div>
        </section>
        <section>
          <div className="container lg:px-4">
            <Recommended />
          </div>
        </section>
        <section className="recent-update">
          <div className="container lg:px-4">
            <RecentUpdate cookie={cookie}/>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Home