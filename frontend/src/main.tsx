import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Cursor from './components/custom/cursor.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Cursor />
    <App />
  </StrictMode>,
)
