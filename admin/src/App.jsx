import { Route, Routes } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import { ProtectedRoute, ProtectedRouteResetPass } from './ProtectedRoutes'
import Layout from './components/layouts/Layout'
import Home from './pages/home'
import ResetPassword from './pages/resetPassword'
import UpdatePassword from './pages/resetPassword/UpdatePassword'
import Manga from './pages/mangaList'
import Upload from './pages/uploadManga'
import Chapter from './pages/uploadChapter'
import ChapterList from './pages/allChapter'
import Persist from './Persist'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={ <Login /> } />
      <Route path="/register" element={ <Register /> } />
      <Route path="/find-account" element={ <ResetPassword /> } />

      <Route element={<Persist />}>
        <Route element={ <ProtectedRoute />} >
          <Route path="/" element={ <Layout /> } >
            <Route index element={ <Home />} />
            <Route path="/manga" element={ <Manga />} />
            <Route path="/manga/upload" element={ <Upload />} />
            <Route path="/manga/chapter/upload" element={ <Chapter/>} />
            <Route path="/manga/chapter" element={ <ChapterList/>} />
          </Route>
        </Route>
      </Route>

      <Route element={ <ProtectedRouteResetPass />} >
        <Route path="/reset-password/update" element={ <UpdatePassword /> } />
      </Route>
    </Routes>
  )
}

export default App