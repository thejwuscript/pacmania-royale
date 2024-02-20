import { useState } from 'react';
import { socket } from '@/app/socket';

interface ChatMessageInputProps {
  username: string
}

export default function ChatMessageInput({ username }: ChatMessageInputProps) {
  const [message, setMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (message.trim() !== "") {
      socket.emit("new chat message", message, username) // also need user's name here
      setMessage("")
    }
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