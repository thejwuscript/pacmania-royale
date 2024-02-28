import { useState, useContext } from 'react';
import { InputWithButton } from './InputWithButton';
import { SocketContext } from './SocketProvider';

interface ChatMessageInputProps {
  username: string
}

export default function ChatMessageInput({ username }: ChatMessageInputProps) {
  const [message, setMessage] = useState("")
  const socket = useContext(SocketContext);

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