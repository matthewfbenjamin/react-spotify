import React, { createContext } from 'react'

export const AppContext = createContext({})

export const APP_STATE_VALUES = {
  ACCESS_TOKEN: 'accessToken',
  ME: 'me',
}

export const AppProvider = ({ children }) => {
  const setPersistedState = (stateKey, setValue) => localStorage.setItem(stateKey, setValue)

  const getPersistedState = (stateKey) => {
    if (Object.values(APP_STATE_VALUES).includes(stateKey)) {
      return localStorage.getItem(stateKey)
    }
    return null
  }

  return (
    <AppContext.Provider value={{
      APP_STATE_VALUES,
      getPersistedState,
      setPersistedState,
    }}>
      {children}
    </AppContext.Provider>
  )
}
