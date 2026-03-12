import React, { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import FunctionButton from './FunctionButton'
import { AppContext } from '../AppContext'

// "You Can't Always Get What You Want" - The Rolling Stones
const DEPRECATED_SONG_EMBED = 'https://open.spotify.com/embed/track/6lFZbCc7pn6Lme1NP7qQqQ?autoplay=1'

const DeprecationModal = ({ show, onHide, featureName }) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton>
      <Modal.Title>🪦 RIP: {featureName}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>
        Unfortunately, Spotify decided to <strong>remove API access to algorithmically-generated playlists</strong> (Daily Mixes, Daily Drive, etc.) for third-party developers.
      </p>
      <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>
        This feature no longer works. Enjoy this song selected specifically for this moment.
      </p>

      <iframe
        title="deprecation song"
        data-testid="embed-iframe"
        style={{ borderRadius: "12px" }}
        src={DEPRECATED_SONG_EMBED}
        width="100%"
        height="152"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy">
      </iframe>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
)

const Home = () => {
  const { APP_STATE_VALUES: { ACCESS_TOKEN, ME }, getPersistedState, setPersistedState, clearPersistedState } = useContext(AppContext)
  const [shouldReroute, setShouldReroute] = useState(false)
  const [localMe, setLocalMe] = useState(null)
  const [modal, setModal] = useState({ show: false, featureName: '' })
  const accessToken = getPersistedState(ACCESS_TOKEN)

  useEffect(() => {
    const getMe = async () => {
      try {
        const { data } = await axios.get('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        setPersistedState(ME, data)
        setLocalMe(data)
      } catch (error) {
        const status = error.response?.status
        if (status === 401 || status === 403) setShouldReroute(true)
        else setShouldReroute(true)
      }
    }

    const persistedMe = getPersistedState(ME)
    if (!persistedMe) getMe()
    else setLocalMe(persistedMe)
  }, [ME, accessToken, getPersistedState, setPersistedState])

  if (!accessToken || shouldReroute) return <Navigate to="/login" replace />

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
            onClick={() => setModal({ show: true, featureName: 'Remove Podcasts from Daily Drive' })}
            defaultText="Remove Podcasts from Daily Drive"
          />
          <FunctionButton
            onClick={() => setModal({ show: true, featureName: 'Combine all Daily Mixes' })}
            defaultText="Combine all Daily Mixes"
          />
        </>
      )}
      <div>
        <Button variant="danger" onClick={() => {
          clearPersistedState()
          setShouldReroute(true)
        }}>
          Logout
        </Button>
      </div>

      <DeprecationModal
        show={modal.show}
        onHide={() => setModal({ show: false, featureName: '' })}
        featureName={modal.featureName}
      />
    </div>
  )
}

export default Home