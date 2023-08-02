import { Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import MangaOverview from "./pages/mangaOverview"
import MainContent from "./pages/content"
import ResetPassword from "./pages/resetPassword"
import ProtectedRoute from "./ProtectedRoutes"

const App = () => {
  return (
    <Routes>
      <Route path="/"  element={ <Home /> } />
      <Route path="/series/:slug"  element={ <MangaOverview /> } />
      <Route path="/:mangaSlug/:chapterSlug"  element={ <MainContent /> } />
      
      <Route element={ <ProtectedRoute /> }>
        <Route path="/reset-password"  element={ <ResetPassword /> } />
      </Route>
    </Routes>
  )
}

export default App
