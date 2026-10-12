import { useState } from 'react';

export function useSearch() {
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  return {
    searchOpen,
    setSearchOpen,
    openSearch,
    closeSearch,
    toggleSearch
  };
}
