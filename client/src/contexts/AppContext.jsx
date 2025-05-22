import { useContext, createContext, useState } from "react";

const AppContext = createContext();

function AppProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const data = { showLogin, setShowLogin, loading, setLoading };

  return <AppContext.Provider value={data}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}

export default AppProvider;
