import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import { AppProvider } from './AppContext'
import { Login } from './Login'
import { Home } from './Home'
import './App.css'


const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/home">
            <Home />
          </Route>

          <Route path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
