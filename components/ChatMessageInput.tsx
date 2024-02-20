import { useState } from 'react';
import { socket } from '@/app/socket';
import { InputWithButton } from './InputWithButton';

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
      socket.emit("new chat message", message, username)
      setMessage("")
    }
  }

  return (
    <InputWithButton onSubmit={handleSubmit} onChange={handleChange} message={message} />
  )
}