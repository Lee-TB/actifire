import { onSnapshot } from 'firebase/firestore';
import React, { useContext, useState } from 'react';

const AppContext = React.createContext();

function AppProvider({ children }) {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
}

const useAppContext = () => {
  return useContext(AppContext);
};

export { useAppContext };

export default AppProvider;
