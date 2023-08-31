import { Route, Routes } from "react-router-dom"
import { ResetPasswordRoute, UserSettingsRoute } from "./ProtectedRoute"
import Home from "./pages/home"
import Register from "./pages/register"
import Login from "./pages/login"
import Manga from "./pages/manga"
import Chapter from "./pages/chapterView"
import FindAccount from "./pages/findAccount"
import ResetPassword from "./pages/resetPassword"
import UserSettings from "./pages/userSetting"
import UserBookmarks from "./pages/bookmark"
import Layout from "./components/layout/Layout"
import { AuthProvider } from "./context/AuthProvider"
import Persist from "./Persist"
import { GlobalErrorProvider } from "./context/GlablErrorProvider"

const App = () => {
  return (
    <AuthProvider>
      <GlobalErrorProvider>
        <Routes>
          <Route element={<Persist />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/find-account" element={<FindAccount />} />
              <Route path="/series/:mangaSlug" element={<Manga/>} />
              <Route path="/:mangaSlug/:chapterSlug" element={<Chapter />} />
              <Route path="/bookmarks" element={<UserBookmarks/>} />

              {/* ProtectedRoute */}
              <Route element={ <ResetPasswordRoute /> }>
                <Route path="/reset-password"  element={ <ResetPassword /> } />
              </Route>
              <Route element={ <UserSettingsRoute /> }>
                <Route path="/settings" element={<UserSettings />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </GlobalErrorProvider>

    </AuthProvider>
    // <Routes>
    //   <Route path="/" element={<Home />} />
    //   <Route path="/register" element={<Register />} />
    //   <Route path="/login" element={<Login />} />
    //   <Route path="/find-account" element={<FindAccount />} />
    //   <Route path="/series/:mangaSlug" element={<Manga/>} />
    //   <Route path="/:mangaSlug/:chapterSlug" element={<Chapter />} />
    //   <Route path="/bookmarks" element={<UserBookmarks/>} />

    //   {/* ProtectedRoute */}
    //   <Route element={ <ResetPasswordRoute /> }>
    //     <Route path="/reset-password"  element={ <ResetPassword /> } />
    //   </Route>
    //   <Route element={ <UserSettingsRoute /> }>
    //     <Route path="/settings" element={<UserSettings />} />
    //   </Route>
    // </Rotes>
  )
}

export default App