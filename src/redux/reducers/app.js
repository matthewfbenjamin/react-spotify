import { SET_TOKEN } from '../actionTypes'

const initialState = {
  token: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_TOKEN: {
    //   const { token } = action.payload
      return {
        ...state,
      }
    }
    default:
      return state
  }
}
