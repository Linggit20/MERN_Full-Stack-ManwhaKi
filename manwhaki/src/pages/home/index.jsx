import React from "react"
import Navbar from "../../components/Navbar"
import Featured from "../../components/Featured"
import Recommended from "../../components/Recommended"
import RecentUpdate from "../../components/RecentUpdate"
import ScrollTopButton from "../../components/ScrollTopButton"
import Footer from "../../components/Footer"

const Home = () => {

  return (
    <>
      <Navbar />
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
            <RecentUpdate />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Home