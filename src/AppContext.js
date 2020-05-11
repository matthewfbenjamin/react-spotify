import React, { createContext } from 'react'

export const AppContext = createContext({})

export const APP_STATE_VALUES = {
  ACCESS_TOKEN: {
    key: 'accessToken',
    type: 'string',
  },
  ME: {
    key: 'me',
    type: 'object',
  },
}

export const AppProvider = ({ children }) => {
  const setPersistedState = (state, setValue) => {
    if (state.type === 'object') {
      localStorage.setItem(state.key, JSON.stringify(setValue))  
    } else {
      localStorage.setItem(state.key, setValue)
    }
  }

  const getPersistedState = (state) => {
    try {
      if (state.type === 'object') {
        const item = localStorage.getItem(state.key)
        if (item) return JSON.parse(item)
        return null
      } else {
        return localStorage.getItem(state.key)
      }
    } catch {
      localStorage.clear()
    }
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
