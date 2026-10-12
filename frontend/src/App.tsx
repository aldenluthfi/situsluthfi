import { lazy, Suspense, useEffect } from "react"
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom"
import Footer from "@/components/footer"
import Header from "@/components/header"
import ThemeProvider from "@/components/theme-provider"
import Home from "@/pages/Home"

const Projects = lazy(() => import("@/pages/Projects"))
const Blog = lazy(() => import("@/pages/Blog"))
const Post = lazy(() => import("@/pages/Post"))
const Archive = lazy(() => import("@/pages/Archive"))
const NotFound = lazy(() => import("@/pages/NotFound"))

function Layout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-[53rem] flex-1 px-4 pt-12 sm:px-6">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

/** vI URLs that search engines and old links still point at. */
function LegacyWriting() {
  const { slug } = useParams()
  return <Navigate to={`/blog/${slug}`} replace />
}

/** Pages that only exist in vI: hand off to the archived build. */
function ToArchive({ path }: { path: string }) {
  useEffect(() => {
    window.location.replace(`/archive/vI${path}`)
  }, [path])
  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<Post />} />
            <Route path="archive" element={<Archive />} />
            <Route path="writings" element={<Navigate to="/blog" replace />} />
            <Route path="writings/:slug" element={<LegacyWriting />} />
            <Route path="license" element={<ToArchive path="/license" />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
