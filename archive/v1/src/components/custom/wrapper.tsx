import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return children;
};

export default Wrapper;
