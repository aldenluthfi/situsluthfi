import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import License from './pages/License'
import { ThemeProvider } from "@/components/custom/theme-provider"


function App() {

  return (
    <ThemeProvider storageKey="vite-ui-theme" defaultMode="dark" defaultTheme="yellow" >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/license" element={<License />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
