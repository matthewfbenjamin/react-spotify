import axios from 'axios'

import { YOUR_DAILY_DRIVE_ID, DAILY_DRIVE_OVERWRITE_NAME } from '../SpotifyCredientials'

export const removePodcastsFromDD = async (accessToken, setDailyDriveState, dailyDriveState, localMe) => {
  try {
    const spotifyApiInstance = axios.create({
      baseURL: 'https://api.spotify.com/v1',
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const addItemsToPlaylist = async (existingPlaylistId, trackUris) => {
      await spotifyApiInstance.post(`/playlists/${existingPlaylistId}/tracks`, {
        uris: trackUris,
      })
    }

    const replaceItemsInPlaylist = async (existingPlaylistId, trackUris) => {
      debugger
      await spotifyApiInstance.put(`/playlists/${existingPlaylistId}/tracks`, {
        uris: trackUris,
      })
    }

    setDailyDriveState({ ...dailyDriveState, isLoading: true, error: null })
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
        if (idx > 0 && trackItem.track.type === 'track' && trackItem.track.artists[0].name !== 'Spotify') acc.push(trackItem.track.uri)
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
      setDailyDriveState({ ...dailyDriveState, isLoading: false })
    }
  } catch (error) {
    // TODO: Signout if access token no longer valid
    // if (badAccessToken) setShouldReroute(true)
    setDailyDriveState({ isLoading: false, didLoad: true, error })
  }
}