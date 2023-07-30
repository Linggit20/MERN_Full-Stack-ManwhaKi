import React from 'react'
import Navbar from '../../components/Navbar'
import MangaInfo from '../../components/MangaInfo'
import MangaChapter from '../../components/MangaChapter'
import Footer from '../../components/Footer'
import ScrollTopButton from '../../components/ScrollTopButton'

const MangaOverview = () => {

  return (
    <>
      <Navbar />
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