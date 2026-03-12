import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'

import { AppProvider } from './AppContext'
import { Login } from './Login'
import { Home } from './Home'
import './App.css'

const App = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  )
}

export default App