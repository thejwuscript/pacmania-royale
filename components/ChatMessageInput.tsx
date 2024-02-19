import { useState } from 'react';

export default function ChatMessageInput() {
  const [message, setMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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