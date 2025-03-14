import { useState } from 'react'
import Welcome from './components/Welcome.jsx'
import ChatRoom from './components/ChatRoom.jsx'
import './styles.css'

function App() {
  const [roomData, setRoomData] = useState(null)

  return (
    <div className="app">
      {!roomData ? (
        <Welcome setRoomData={setRoomData} />
      ) : (
        <ChatRoom roomData={roomData} setRoomData={setRoomData} />
      )}
    </div>
  )
}

export default App
