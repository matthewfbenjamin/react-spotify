import axios from 'axios'

import { DAILY_MIX_IDS, DAILY_MIX_OVERWRITE_NAME } from '../SpotifyCredientials'

const PLAYLIST_TRACK_LIMIT = 100

export const combineDailyMixes = async (accessToken, setDailyMixesState, dailyMixesState, localMe) => {
  try {
    const spotifyApiInstance = axios.create({
      baseURL: 'https://api.spotify.com/v1',
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const addItemsToPlaylist = async (existingPlaylistId, trackUris, position = 0) => {
      await spotifyApiInstance.post(`/playlists/${existingPlaylistId}/tracks`, {
        uris: trackUris,
        position,
      })
    }

    const replaceItemsInPlaylist = async (existingPlaylistId, trackUris) => {
      await spotifyApiInstance.put(`/playlists/${existingPlaylistId}/tracks`, {
        uris: trackUris,
      })
    }

    const pushTracks = (items, allTracks) => {
      return new Promise((resolve) => {
        items.forEach((trackItem) => allTracks.push(trackItem.track.uri))
        resolve()
      })
    }

    const sliceAllTracks = (allTracks, start, end) => {
      return new Promise((resolve) => {
        const tracksToUpload = allTracks.slice(start, end)
        resolve(tracksToUpload)
      })
    }

    const uploadMaxTracks = (i, playlistId) => {
      return new Promise(async (resolve, reject) => {
        const first = i === 0
        const start = first ? 0 : PLAYLIST_TRACK_LIMIT * i
        const uploadTrackList = await sliceAllTracks(allTrackUris, start, start + PLAYLIST_TRACK_LIMIT)

        let returnId = playlistId
        if (i === 0 && !playlistId) {
          // Create a new playlist and add the track URI's
          const { data } = await spotifyApiInstance.post(`/users/${localMe.id}/playlists`, {
            name: DAILY_MIX_OVERWRITE_NAME,
            public: false,
            collaborative: false,
          })
          
          returnId = data.id
          await addItemsToPlaylist(data.id, uploadTrackList)
        } else {
          // Replace items in the current playlist with the trackUris
          if (first) await replaceItemsInPlaylist(playlistId, uploadTrackList)
          else await addItemsToPlaylist(playlistId, uploadTrackList, PLAYLIST_TRACK_LIMIT * i)
        }
        resolve(returnId)
      })
    }

    setDailyMixesState({ ...dailyMixesState, isLoading: true, error: null })

    const allTrackUris = []
    for (const dailyMixId of DAILY_MIX_IDS) {
      const dailyMixTrackList = await spotifyApiInstance.get(`/playlists/${dailyMixId}`)
      if (
        dailyMixTrackList.data &&
        dailyMixTrackList.data.tracks &&
        dailyMixTrackList.data.tracks.items &&
        dailyMixTrackList.data.tracks.items.length > 0 &&
        localMe
      ) {
        await pushTracks(dailyMixTrackList.data.tracks.items, allTrackUris)
      }
    }
    
    // Get all the playlists and see if the DAILY_MIX_OVERWRITE_NAME exists already
    const playlists = await spotifyApiInstance.get('/me/playlists')

    let existingPlaylistId
    playlists.data.items.forEach((playlistItem) => {
      if (playlistItem.name === DAILY_MIX_OVERWRITE_NAME) existingPlaylistId = playlistItem.id
    })

    for (let i = 0; i < Math.ceil(allTrackUris.length / PLAYLIST_TRACK_LIMIT); i++) {
      existingPlaylistId = await uploadMaxTracks(i, existingPlaylistId)
    }

    setDailyMixesState({ ...dailyMixesState, isLoading: false })
  } catch (error) {
    // TODO: Signout if access token no longer valid
    // if (badAccessToken) setShouldReroute(true)
    if (error === 'Request failed with status code 401') 
    setDailyMixesState({ isLoading: false, didLoad: true, error })
  }
}