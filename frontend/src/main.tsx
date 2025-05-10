import { StrictMode, useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

import Cursor from './components/custom/cursor.tsx'
import Home from './pages/Home'
import License from './pages/License'

import ThemeProvider from "@/components/custom/theme-provider"
import Header from './components/custom/header'
import Footer from './components/custom/footer'

import type { ReactNode } from 'react'
import { Toaster } from "@/components/ui/sonner"

const Wrapper = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return children;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Cursor />
    <Toaster
      toastOptions={{
        classNames: {
          title: "!text-base !font-body-bold",
          description: "!text-sm !font-body !text-muted-foreground",
          toast: "!select-none !border-accent",
        }
      }}
    />
    <ThemeProvider storageKey="vite-ui-theme" defaultMode="dark" defaultTheme="yellow">
      <Router>
        <Wrapper>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/license" element={<License />} />
          </Routes>
          <Footer />
        </Wrapper>
      </Router>
    </ThemeProvider>
  </StrictMode>,
)
