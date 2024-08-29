import { createContext, useContext, useState, ReactNode } from 'react';

interface NavbarContextType {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <NavbarContext.Provider value={{ activeIndex, setActiveIndex }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};
