import Footer from "../../components/Footer"
import Bookmark from "../../components/Bookmark"

const UserBookmarks = () => {
  return (
    <div className="layout">
      {/* <Navbar /> */}
      <div className="h-screen flex justify-between flex-col">
        <main>
          <div className="container lg:px-4">
            <Bookmark />
          </div>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </div>
  )
}

export default UserBookmarks