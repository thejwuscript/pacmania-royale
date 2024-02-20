import ChatMessageInput from "./ChatMessageInput"
import type { User } from "@/types/common"

interface ChatBoxProps {
  messages: string[],
  currentUser: User,
}

export default function ChatBox({ messages, currentUser }: ChatBoxProps) {
  return (
    <div>
      <h3>ChatBox</h3>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <ChatMessageInput username={currentUser.name} />
    </div>
  )
}