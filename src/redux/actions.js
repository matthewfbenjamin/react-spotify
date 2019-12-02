import { SET_TOKEN_START, SET_TOKEN_SUCCESS, GET_IMAGES_ERROR } from './actionTypes'
import hash from '../hash'

const getUserInfoStart = () => ({
    type: SET_TOKEN_START
})
  
const getUserInfoSuccess = (token) => ({
    type: SET_TOKEN_SUCCESS,
    token,
})
  
const getUserInfoError = (error) => ({
    type: GET_IMAGES_ERROR,
    error,
})

// TODO: Set the token after the button is pressed by accessing the hash
// TODO: Call getUserInfo from app.js whenever the token is set

export const getUserInfo = (page) => async (dispatch) => {
    dispatch(getUserInfoStart())
    try {
        let _token = hash.access_token
        if (_token) {
            const data = await fetch('https://api.spotify.com/v1/me/player', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${_token}`
              },
            })
            setItem(data.item)
            setIsPlaying(data.is_playing)
            setProgress(data.progress_ms)
            // TODO: Set these in the redux (global) state
          }
        dispatch(getUserInfoSuccess()) // Pass token here
    } catch (error) {
      dispatch(getUserInfoError(error))
      console.error(error)
    }
  }
  