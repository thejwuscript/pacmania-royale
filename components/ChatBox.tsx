import ChatMessageInput from "./ChatMessageInput"
import type { Message, User } from "@/types/common"

interface ChatBoxProps {
  messages: Message[],
  currentUser: User,
}

export default function ChatBox({ messages, currentUser }: ChatBoxProps) {
  return (
    <div className="col-span-1 row-start-3 row-end-4">
      <h3>ChatBox</h3>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            {message.sender && "<" + message.sender + ">: "}{message.content}
          </li>
        ))}
      </ul>
      <ChatMessageInput username={currentUser.name} />
    </div>
  )
}