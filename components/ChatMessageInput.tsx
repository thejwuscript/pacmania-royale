import { useState } from 'react';
import { socket } from '@/app/socket';

export default function ChatMessageInput() {
  const [message, setMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    socket.emit("new chat message", message)
    setMessage("")
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={message} onChange={handleChange} placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}