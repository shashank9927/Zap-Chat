import { useState, useEffect, useRef } from 'react'
import socket from '../socket'
import '../styles.css'

const ChatRoom = ({ roomData, setRoomData }) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [notification, setNotification] = useState({ type: '', message: '' })
  const messagesEndRef = useRef(null)

  useEffect(() => {
    setMessages(roomData.messages || [])
    setUsers(roomData.users || [])
  }, [roomData])

  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      setMessages((prev) => [...prev, newMessage])
    }

    const handleUserJoined = ({ username, users }) => {
      setUsers(users)
      setNotification({
        type: 'info',
        message: `~${username} joined the room`
      })
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification({ type: '', message: '' })
      }, 3000)
    }

    const handleUserLeft = ({ username, users }) => {
      setUsers(users)
      setNotification({
        type: 'info',
        message: `~${username} left the room`
      })
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification({ type: '', message: '' })
      }, 3000)
    }

    socket.on('receive_message', handleReceiveMessage)
    socket.on('user_joined', handleUserJoined)
    socket.on('user_left', handleUserLeft)

    return () => {
      socket.off('receive_message', handleReceiveMessage)
      socket.off('user_joined', handleUserJoined)
      socket.off('user_left', handleUserLeft)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    socket.emit('send_message', {
      roomCode: roomData.roomCode,
      message,
      username: roomData.username,
    })
    setMessage('')
  }

  const handleLeaveRoom = () => {
    socket.disconnect()
    setRoomData(null)
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2 className="room-code">Room: {roomData.roomCode}</h2>
        <button className="btn btn-leave" onClick={handleLeaveRoom}>
          Leave Room
        </button>
      </div>

      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="chat-main">
        <div className="users-list">
          <h3 className="users-title">Users ({users.length})</h3>
          {users.map((user) => (
            <div key={user.id} className="user-item">
              ~{user.username}
              {user.username === roomData.username && ' (You)'}
            </div>
          ))}
        </div>

        <div className="messages-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.username === roomData.username ? 'sent' : 'received'}`}
            >
              <div className="message-username">~{msg.username}</div>
              <div className="message-text">{msg.text}</div>
              <div className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form className="message-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" className="btn btn-send">
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatRoom 