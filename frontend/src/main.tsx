import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Cursor from './components/custom/cursor.tsx'
import Home from './pages/Home'
import License from './pages/License'

import ThemeProvider from "@/components/custom/theme-provider"
import Header from './components/custom/header'
import Footer from './components/custom/footer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Cursor />
    <ThemeProvider storageKey="vite-ui-theme" defaultMode="dark" defaultTheme="yellow">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/license" element={<License />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  </StrictMode>,
)
