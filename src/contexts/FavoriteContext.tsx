import { Dispatch, SetStateAction, createContext, useState } from "react";

type FavoriteContextType = {
  onlyFavorites: boolean;
  setOnlyFavorites: Dispatch<SetStateAction<boolean>>
};

const FavoriteContext = createContext({} as FavoriteContextType);

const FavoriteProvider = ({ children }: { children: React.ReactNode }) => {
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  return (
    <FavoriteContext.Provider value={{ onlyFavorites, setOnlyFavorites }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export { FavoriteContext, FavoriteProvider };
