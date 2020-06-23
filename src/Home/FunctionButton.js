import React from 'react'
import Button from 'react-bootstrap/Button'

const FunctionButton = ({ isLoading, onClick, loadingText, defaultText, error }) => (
  <div>
    <Button
      variant="success"
      onClick={isLoading ? null : onClick}
      disabled={isLoading}
    >
      {isLoading ? loadingText : defaultText}
    </Button>
    {error &&
      <div
        style={{ marginTop: 8, color: 'red' }}
      >
        {error.message || error}
      </div>
    }
  </div>
)

export default FunctionButton