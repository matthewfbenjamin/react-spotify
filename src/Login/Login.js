import React, { useState, useEffect, useContext } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import { Redirect } from 'react-router-dom'

import { AppContext } from '../AppContext'
import { clientId, redirectUri, scopes, hash } from '../SpotifyCredientials'

export const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'

const Login = () => {
  const { APP_STATE_VALUES: { ACCESS_TOKEN }, setPersistedState } = useContext(AppContext)
  const [gettingToken, setGettingToken] = useState(false)
  const [redirect, setRedirect] = useState(false)
  
  useEffect(() => {
    const _token = hash.access_token
    if (_token) {
      setPersistedState(ACCESS_TOKEN, _token)
      setRedirect(true)
    }
  }, [setPersistedState, ACCESS_TOKEN])

  if (redirect) return <Redirect to="/home" />
  return (
    <div className="App">
      <header className="App-header">
        {!gettingToken ? (
          <a
            className="btn btn--loginApp-link"
            href={`${AUTH_ENDPOINT}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
              "%20"
            )}&response_type=token&show_dialog=true`}
            onClick={() => setGettingToken(true)}
          >
            <Button variant="success">
              Login to Spotify
            </Button>
          </a>
        ) : <Spinner animation="border" role="status" />}
      </header>
    </div>
  )
}

export default Login