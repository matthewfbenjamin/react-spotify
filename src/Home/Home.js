import React, { useContext, useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import Button from 'react-bootstrap/Button'

import FunctionButton from './FunctionButton'
import { AppContext } from '../AppContext'
import { removePodcastsFromDD } from './useDailyDrive'
import { combineDailyMixes } from './combineDailyMixes'

const Home = () => {
  const { APP_STATE_VALUES: { ACCESS_TOKEN, ME }, getPersistedState, setPersistedState, clearPersistedState } = useContext(AppContext)
  const [shouldReroute, setShouldReroute] = useState(false)
  const [dailyDriveState, setDailyDriveState] = useState({ isLoading: false, didLoad: false, error: null })
  const [dailyMixState, setDailyMixState] = useState({ isLoading: false, didLoad: false, error: null })
  const [localMe, setLocalMe] = useState(null)
  const accessToken = getPersistedState(ACCESS_TOKEN)

  useEffect(() => {
    const getMe = async () => {
      try {
        const { data } = await axios.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        setPersistedState(ME, data)
        setLocalMe(data)
      } catch (error) {
        setShouldReroute(true)
      }
    }

    const persistedMe = getPersistedState(ME)
    if (!persistedMe) getMe()
    else setLocalMe(persistedMe)
  }, [ME, accessToken, getPersistedState, setPersistedState])

  if (!accessToken || shouldReroute) return <Redirect to="/login" />

  return (
    <div style={{
      padding: '30px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      {localMe && (
        <>
          <FunctionButton
            isLoading={dailyDriveState.isLoading}
            onClick={() => removePodcastsFromDD(accessToken, setDailyDriveState, dailyDriveState, localMe)}
            loadingText="Removing..."
            defaultText="Remove Podcasts from Daily Drive"
            error={dailyDriveState.error}
          />
          <FunctionButton
            isLoading={dailyMixState.isLoading}
            onClick={() => combineDailyMixes(accessToken, setDailyMixState, dailyMixState, localMe)}
            loadingText="Combining..."
            defaultText="Combine all Daily Mixes"
            error={dailyMixState.error}
          />
        </>
      )
      }
      <div>
        <Button variant="danger" onClick={() => {
            clearPersistedState()
            setShouldReroute(true)
          }}>
          Logout
        </Button>
      </div>
    </div>
  )
}

export default Home
