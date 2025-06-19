import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { IconHome, IconBook, IconFolder, IconPhoto, IconScale, IconRefresh, IconSearch } from '@tabler/icons-react'

import Cursor from './components/custom/cursor'
import LoadingScreen from './components/custom/loading-screen'
import Home from './pages/Home'
import License from './pages/License'
import Writings from './pages/Writings'
import Writing from './pages/Writing'
import Projects from './pages/Projects'
import Gallery from './pages/Gallery'

import ThemeProvider from "@/components/custom/theme-provider"
import Header from './components/custom/header'
import Footer from './components/custom/footer'
import Wrapper from './components/custom/wrapper'

import { Toaster } from "@/components/ui/sonner"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut
} from "@/components/ui/context-menu"
import { SearchDialog } from '@/components/custom/search-dialog'
import { isWindows, isMobile } from '@/lib/utils'
import { useSearch } from './hooks/use-search'
import { useAssetLoading } from './hooks/use-asset-loading'

export default function App() {
  const { searchOpen, setSearchOpen, openSearch, toggleSearch } = useSearch();
  const { isLoading } = useAssetLoading();
  const [showApp, setShowApp] = useState(false);

  const handleLoadingComplete = () => {
    setShowApp(true);
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isLoading || !showApp) return;

      const modifierKey = isWindows ? e.ctrlKey : e.metaKey;

      if (modifierKey && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
        return;
      }

      if (searchOpen) return;

      if (modifierKey && (e.key.toLowerCase() === 'u' || e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'o' || e.key.toLowerCase() === 'l' || e.key.toLowerCase() === 'h')) {
        e.preventDefault();
        switch (e.key.toLowerCase()) {
          case 'u':
            window.location.href = '/projects';
            break;
          case 'i':
            window.location.href = '/writings';
            break;
          case 'o':
            window.location.href = '/gallery';
            break;
          case 'l':
            window.location.href = '/license';
            break;
          case 'h':
            window.location.href = '/';
            break;
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [searchOpen, toggleSearch, isLoading, showApp]);

  return (
    <ThemeProvider storageKey="vite-ui-theme" defaultMode="dark" defaultTheme="yellow">
      {!showApp ?
        <LoadingScreen isLoading={isLoading} onLoadingComplete={handleLoadingComplete} />
        : (
          <>
            <Cursor />
            <Toaster
              toastOptions={{
                classNames: {
                  title: "!text-base !font-bold",
                  description: "!text-sm !text-muted-foreground",
                  toast: "!select-none !font-body !border-accent",
                }
              }}
            />
            <Router>
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <div className="min-h-screen">
                    <Wrapper>
                      <Header onSearchClick={openSearch} />
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/license" element={<License />} />
                        <Route path="/writings" element={<Writings />} />
                        <Route path="/writings/:slug" element={<Writing />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/projects" element={<Projects />} />
                      </Routes>
                      <Footer />
                    </Wrapper>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className='p-1.5 flex flex-col gap-1.5 z-2000'>
                  <ContextMenuItem className='text-base group' onClick={openSearch} data-slot="button">
                    <div className="flex items-center gap-4 mr-8">
                      <IconSearch className="size-6" stroke={1.5} />
                      Search
                    </div>
                    <ContextMenuShortcut className={`ml-auto rounded-sm py-1 pl-2 pr-1.5 flex gap-1 items-center text-xs whitespace-nowrap bg-muted text-muted-foreground group-hover:bg-primary-300 group-hover:text-primary-700 ${isMobile ? "opacity-0" : ""}`}>
                      <div className="!text-sm">⌘</div> K
                    </ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuSeparator className='my-0.25' />
                  <ContextMenuItem className='text-base group' onClick={() => window.location.href = '/'} data-slot="button">
                    <div className="flex items-center gap-4 mr-8">
                      <IconHome className="size-6" stroke={1.5} />
                      Home
                    </div>
                    <ContextMenuShortcut className={`ml-auto rounded-sm py-1 pl-2 pr-1.5 flex gap-1 items-center text-xs whitespace-nowrap bg-muted text-muted-foreground group-hover:bg-primary-300 group-hover:text-primary-700 ${isMobile ? "opacity-0" : ""}`}>
                      <div className="!text-sm">⌘</div> H
                    </ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem className='text-base group' onClick={() => window.location.href = '/projects'} data-slot="button">
                    <div className="flex items-center gap-4 mr-8">
                      <IconFolder className="size-6" stroke={1.5} />
                      Projects
                    </div>
                    <ContextMenuShortcut className={`ml-auto rounded-sm py-1 pl-2 pr-1.5  flex gap-1 items-center text-xs whitespace-nowrap bg-muted text-muted-foreground group-hover:bg-primary-300 group-hover:text-primary-700 ${isMobile ? "opacity-0" : ""}`}>
                      <div className="!text-sm">⌘</div> U
                    </ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem className='text-base group' onClick={() => window.location.href = '/writings'} data-slot="button">
                    <div className="flex items-center gap-4 mr-8">
                      <IconBook className="size-6" stroke={1.5} />
                      Writings
                    </div>
                    <ContextMenuShortcut className={`ml-auto rounded-sm py-1 pl-2 pr-1.5 flex gap-1 items-center text-xs whitespace-nowrap bg-muted text-muted-foreground group-hover:bg-primary-300 group-hover:text-primary-700 ${isMobile ? "opacity-0" : ""}`}>
                      <div className="!text-sm">⌘</div> I
                    </ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem className='text-base group' onClick={() => window.location.href = '/gallery'} data-slot="button">
                    <div className="flex items-center gap-4 mr-8">
                      <IconPhoto className="size-6" stroke={1.5} />
                      Gallery
                    </div>
                    <ContextMenuShortcut className={`ml-auto rounded-sm py-1 pl-2 pr-1.5 flex gap-1 items-center text-xs whitespace-nowrap bg-muted text-muted-foreground group-hover:bg-primary-300 group-hover:text-primary-700 ${isMobile ? "opacity-0" : ""}`}>
                      <div className="!text-sm">⌘</div> O
                    </ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuSeparator className='my-0.25' />
                  <ContextMenuItem className='text-base group' onClick={() => window.location.href = '/license'} data-slot="button">
                    <div className="flex items-center gap-4 mr-8">
                      <IconScale className="size-6" stroke={1.5} />
                      License
                    </div>
                    <ContextMenuShortcut className={`ml-auto rounded-sm py-1 pl-2 pr-1.5 flex gap-1 items-center text-xs whitespace-nowrap bg-muted text-muted-foreground group-hover:bg-primary-300 group-hover:text-primary-700 ${isMobile ? "opacity-0" : ""}`}>
                      <div className="!text-sm">⌘</div> L
                    </ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem className='text-base group' onClick={() => window.location.reload()} data-slot="button">
                    <div className="flex items-center gap-4 mr-8">
                      <IconRefresh className="size-6" stroke={1.5} />
                      Refresh
                    </div>
                    <ContextMenuShortcut className={`ml-auto rounded-sm py-1 pl-2 pr-1.5 flex gap-1 items-center text-xs whitespace-nowrap bg-muted text-muted-foreground group-hover:bg-primary-300 group-hover:text-primary-700 ${isMobile ? "opacity-0" : ""}`}>
                      <div className="!text-sm">⌘</div> R
                    </ContextMenuShortcut>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
              <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
            </Router>
          </>
        )}
    </ThemeProvider>
  )
}
