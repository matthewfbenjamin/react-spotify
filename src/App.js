import React, { Component, useEffect, useState } from "react"
import { authEndpoint, clientId, redirectUri, scopes } from "./config"
import hash from "./hash"
import Player from "./Player"
import logo from "./logo.svg"
import "./App.css"

const App = () => {
  const [token, setToken] = useState(null)
  const [item, setItem] = useState({
    album: {
      images: [{ url: '' }],
    },
    name: '',
    artists: [{ name: '' }],
    durationMS: 0,
  })
  const [isPlaying, setIsPlaying] = useState('paused')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Set token
    let _token = hash.access_token
    const getCurrentlyPlaying = async () => {
      try {
        if (token) {
          const data = await fetch('https://api.spotify.com/v1/me/player', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            },
          })
          setItem(data.item)
          setIsPlaying(data.is_playing)
          setProgress(data.progress_ms)
          // TODO: Set these in the redux (global) state
        }
      } catch {
        // TODO
      }
    }

    if (_token) {
      setToken(_token)
      getCurrentlyPlaying()
    }
  }, [token])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {!token && (
          <a
            className="btn btn--loginApp-link"
            href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
              "%20"
            )}&response_type=token&show_dialog=true`}
          >
            Login to Spotify
          </a>
        )}
        {token && (
          <Player
            item={item}
            is_playing={isPlaying}
            progress_ms={progress}
          />
        )}
      </header>
    </div>
  )
}

export default App
