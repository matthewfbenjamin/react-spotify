import React, { useContext, useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import Button from 'react-bootstrap/Button'

import { AppContext } from '../AppContext'
import { YOUR_DAILY_DRIVE_ID, DAILY_DRIVE_OVERWRITE_NAME } from '../SpotifyCredientials'

const Home = () => {
  const { APP_STATE_VALUES: { ACCESS_TOKEN, ME }, getPersistedState, setPersistedState } = useContext(AppContext)
  const [shouldReroute, setShouldReroute] = useState(false)
  // const [playlistState, setPlaylistState] = useState({ isLoading: false, didLoad: false, playlists: [] })
  const [dailyDriveState, setDailyDriveState] = useState({ isLoading: false, didLoad: false })
  const [localMe, setLocalMe] = useState(null)
  const accessToken = getPersistedState(ACCESS_TOKEN)

  useEffect(() => {
    const getMe = async () => {
      try {
        const me = await axios.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        setPersistedState(ME, me)
        setLocalMe(me)
      } catch (error) {
        setShouldReroute(true)
      }
    }
  }, [])
  /*
  useEffect(() => {
    const getPlaylists = async () => {
      try {
        setPlaylistState({ ...playlistState, isLoading: true })
        const playlists = await axios.get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        if (playlists.data && playlists.data.items) setPlaylistState({ isLoading: false, didLoad: true, playlists: playlists.data.items, e: null })
        else setShouldReroute(true)
      } catch (e) {
        setPlaylistState({ isLoading: false, didLoad: true, error: e, playlists: [] })
        setShouldReroute(true)
      }
    }
    // getPlaylists()
    // setPlaylistState({ ...playlistState, playlists: playlistsExample.items })
  }, [accessToken, playlistState])
  */

  const removePodcastsFromDD = async () => {
    try {
      setDailyDriveState({ ...dailyDriveState, isLoading: true })
      // GET THE USER'S DAILY DRIVE (Only works for me, now)
      // TODO: Update for everyone
      const dailyDriveTrackList = await axios.get(`https://api.spotify.com/v1/playlists/${YOUR_DAILY_DRIVE_ID}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (
        dailyDriveTrackList.tracks &&
        dailyDriveTrackList.tracks.items &&
        dailyDriveTrackList.tracks.items.length > 0 &&
        localMe
      ) {
        // Get all the playlists and see if the DAILY_DRIVE_OVERWRITE_NAME exists already
        const playlists = await axios.get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        let existingPlaylistId
        playlists.data.items.forEach((playlistItem) => {
          if (playlistItem === DAILY_DRIVE_OVERWRITE_NAME) existingPlaylistId = playlistItem.id
        })

        const trackUris = dailyDriveTrackList.tracks.items.reduce((acc, trackItem, idx) => {
          if (idx > 0 && trackItem.track.type === 'track') acc.concat(trackItem.uri)
          return acc
        }, [])

        if (existingPlaylistId) {
          // Replace items in the current playlist with the trackUris
          const jsonTrackUris = JSON.stringify({uris: trackUris })
          console.log(jsonTrackUris)
          axios.put(`https://api.spotify.com/v1/playlists/${existingPlaylistId}/tracks`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": 'application/json',
            },
            data: jsonTrackUris,
          })
        } else {
          // TODO: Create a new playlist and add the track URI's
        }

        axios.post(`https://api.spotify.com/v1/users/${localMe.id}/playlists`, {
          firstName: 'Fred',
          lastName: 'Flintstone'
        })
        console.log(trackUris)
      }
    } catch (error) {
      setDailyDriveState({ isLoading: false, didLoad: true, error })
    }
  }

  if (!accessToken || shouldReroute) return <Redirect to="/login" />

  return (
    <div style={{
      padding: '30px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <div>
        <Button variant="success" onClick={removePodcastsFromDD}>
          Remove Podcasts from Daily Drive
        </Button>
      </div>
      <div>
        <Button variant="danger" onClick={() => setShouldReroute(true)}>
          Logout
        </Button>
      </div>
    </div>
  )
}

export default Home
