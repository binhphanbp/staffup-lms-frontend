'use client';

import React, { createContext, useContext, useState } from 'react';

interface MobileNavContextType {
  mobileOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
}

const MobileNavContext = createContext<MobileNavContextType>({
  mobileOpen: false,
  openMobileNav: () => {},
  closeMobileNav: () => {},
});

export const MobileNavProvider = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <MobileNavContext.Provider
      value={{
        mobileOpen,
        openMobileNav: () => setMobileOpen(true),
        closeMobileNav: () => setMobileOpen(false),
      }}
    >
      {children}
    </MobileNavContext.Provider>
  );
};

export const useMobileNav = () => useContext(MobileNavContext);
