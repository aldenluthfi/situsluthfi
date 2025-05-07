import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { ThemeProvider } from "@/components/custom/theme-provider"


function App() {

  return (
    <ThemeProvider storageKey="vite-ui-theme" defaultMode="dark" defaultTheme="yellow" >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
