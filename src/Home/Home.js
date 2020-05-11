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

  const spotifyApiInstance = axios.create({
    baseURL: 'https://api.spotify.com/v1',
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  useEffect(() => {
    const getMe = async () => {
      try {
        const { data } = await spotifyApiInstance.get('/me')
        setPersistedState(ME, data)
        setLocalMe(data)
      } catch (error) {
        setShouldReroute(true)
      }
    }

    const persistedMe = getPersistedState(ME)
    if (!persistedMe) getMe()
    else setLocalMe(persistedMe)
  }, [ME, accessToken, getPersistedState, setPersistedState, spotifyApiInstance])

  const removePodcastsFromDD = async () => {
    try {
      setDailyDriveState({ ...dailyDriveState, isLoading: true })
      // GET THE USER'S DAILY DRIVE (Only works for me, now)
      // TODO: Update for everyone
      const dailyDriveTrackList = await spotifyApiInstance.get(`/playlists/${YOUR_DAILY_DRIVE_ID}`)
      if (
        dailyDriveTrackList.data &&
        dailyDriveTrackList.data.tracks &&
        dailyDriveTrackList.data.tracks.items &&
        dailyDriveTrackList.data.tracks.items.length > 0 &&
        localMe
      ) {
        // Get all the playlists and see if the DAILY_DRIVE_OVERWRITE_NAME exists already
        const playlists = await spotifyApiInstance.get('/me/playlists')

        let existingPlaylistId
        playlists.data.items.forEach((playlistItem) => {
          if (playlistItem.name === DAILY_DRIVE_OVERWRITE_NAME) existingPlaylistId = playlistItem.id
        })

        const trackUris = dailyDriveTrackList.data.tracks.items.reduce((acc, trackItem, idx) => {
          if (idx >= 0 && trackItem.track.type === 'track') acc.push(trackItem.track.uri)
          return acc
        }, [])
        
        if (existingPlaylistId) {
          // Replace items in the current playlist with the trackUris
          await replaceItemsInPlaylist(existingPlaylistId, trackUris)
        } else {
          // Create a new playlist and add the track URI's
          const { data } = await spotifyApiInstance.post(`/users/${localMe.id}/playlists`, {
            name: DAILY_DRIVE_OVERWRITE_NAME,
            public: false,
            collaborative: false,
          })
          await addItemsToPlaylist(data.id, trackUris)
        }
      }
    } catch (error) {
      // TODO: Signout if access token no longer valid
      // if (badAccessToken) setShouldReroute(true)
      setDailyDriveState({ isLoading: false, didLoad: true, error })
    }
  }

  const addItemsToPlaylist = async (existingPlaylistId, trackUris) => {
    await spotifyApiInstance.post(`/playlists/${existingPlaylistId}/tracks`, {
      uris: trackUris,
    })
  }

  const replaceItemsInPlaylist = async (existingPlaylistId, trackUris) => {
    await spotifyApiInstance.put(`/playlists/${existingPlaylistId}/tracks`, {
      uris: trackUris,
    })
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
        {localMe &&
          <Button variant="success" onClick={removePodcastsFromDD}>
            Remove Podcasts from Daily Drive
          </Button>
        }
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
