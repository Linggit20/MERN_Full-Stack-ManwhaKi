import { Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import MangaOverview from "./pages/mangaOverview"


const App = () => {
  return (
    <Routes>
      <Route path="/"  element={ <Home /> } />
      <Route path="/series/:slug"  element={ <MangaOverview /> } />
    </Routes>
  )
}

export default App
