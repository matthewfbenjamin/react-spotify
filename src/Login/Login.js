import React, { useState, useEffect, useContext } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import { Navigate } from 'react-router-dom'

import { AppContext } from '../AppContext'
import { clientId, redirectUri, scopes } from '../SpotifyCredientials'

export const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
export const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'

const generateCodeVerifier = () => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

const generateCodeChallenge = async (verifier) => {
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

const Login = () => {
  const { APP_STATE_VALUES: { ACCESS_TOKEN }, setPersistedState } = useContext(AppContext)
  const [gettingToken, setGettingToken] = useState(false)
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    const exchangeToken = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const verifier = localStorage.getItem('pkce_verifier')

      if (!code || !verifier) return

      setGettingToken(true)
      try {
        const response = await fetch(TOKEN_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            code_verifier: verifier,
          })
        })
        const data = await response.json()
        console.log('data', data)
        localStorage.removeItem('pkce_verifier')
        setPersistedState(ACCESS_TOKEN, data.access_token)
        setRedirect(true)
      } catch (error) {
        console.error('Token exchange failed', error)
        setGettingToken(false)
      }
    }

    exchangeToken()
  }, [setPersistedState, ACCESS_TOKEN])

  const handleLogin = async () => {
    setGettingToken(true)
    const verifier = generateCodeVerifier()
    const challenge = await generateCodeChallenge(verifier)
    localStorage.setItem('pkce_verifier', verifier)

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: scopes.join(' '),
      code_challenge_method: 'S256',
      code_challenge: challenge,
    })

    window.location = `${AUTH_ENDPOINT}?${params.toString()}`
  }

  if (redirect) return <Navigate to="/home" replace />
  return (
    <div className="App">
      <header className="App-header">
        {!gettingToken ? (
          <Button variant="success" onClick={handleLogin}>
            Login to Spotify
          </Button>
        ) : <Spinner animation="border" role="status" />}
      </header>
    </div>
  )
}

export default Login