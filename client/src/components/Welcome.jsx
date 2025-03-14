import { useState, useEffect } from 'react'
import socket from '../socket'
import '../styles.css'

const Welcome = ({ setRoomData }) => {
  const [username, setUsername] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [notification, setNotification] = useState({ type: '', message: '' })

  useEffect(() => {
    const handleRoomCreated = (data) => {
      setRoomData(data)
      setNotification({
        type: 'success',
        message: `Room Created! Share this code with others: ${data.roomCode}`
      })
    }

    const handleRoomJoined = (data) => {
      setRoomData(data)
      setNotification({
        type: 'success',
        message: 'Joined room successfully'
      })
    }

    const handleRoomError = (data) => {
      setNotification({
        type: 'error',
        message: data.message
      })
      setIsCreating(false)
    }

    socket.on('room_created', handleRoomCreated)
    socket.on('room_joined', handleRoomJoined)
    socket.on('room_error', handleRoomError)

    return () => {
      socket.off('room_created', handleRoomCreated)
      socket.off('room_joined', handleRoomJoined)
      socket.off('room_error', handleRoomError)
    }
  }, [setRoomData])

  const handleCreateRoom = (e) => {
    e.preventDefault()
    if (!username.trim()) {
      setNotification({
        type: 'error',
        message: 'Please enter a username'
      })
      return
    }
    setIsCreating(true)
    setNotification({ type: '', message: '' })
    socket.emit('create_room', username)
  }

  const handleJoinRoom = (e) => {
    e.preventDefault()
    if (!username.trim() || !roomCode.trim()) {
      setNotification({
        type: 'error',
        message: 'Please enter both username and room code'
      })
      return
    }
    setNotification({ type: '', message: '' })
    socket.emit('join_room', { roomCode: roomCode.toUpperCase(), username })
  }

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Welcome to Chat App</h1>
      <p className="welcome-subtitle">Create a new room or join an existing one</p>

      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Username</label>
        <input
          type="text"
          className="form-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
      </div>

      {!isCreating && (
        <div className="form-group">
          <label className="form-label">Room Code</label>
          <input
            type="text"
            className="form-input"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="Enter room code"
          />
        </div>
      )}

      <button
        className="btn btn-primary"
        onClick={handleCreateRoom}
        disabled={isCreating}
      >
        {isCreating ? 'Creating...' : 'Create New Room'}
      </button>

      {!isCreating && (
        <button
          className="btn btn-secondary"
          onClick={handleJoinRoom}
        >
          Join Room
        </button>
      )}
    </div>
  )
}

export default Welcome 