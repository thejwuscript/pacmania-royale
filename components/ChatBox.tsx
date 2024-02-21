import ChatMessageInput from "./ChatMessageInput"
import type { Message, User } from "@/types/common"

interface ChatBoxProps {
  messages: Message[],
  currentUser: User,
}

export default function ChatBox({ messages, currentUser }: ChatBoxProps) {
  return (
    <div className="relative flex flex-col gap-2 p-2 border-2 border-black h-full">
      <ul className="flex flex-col-reverse h-full overflow-y-auto">
        {messages.toReversed().map((message, index) => (
          <li key={index} className="">
            {message.sender && "<" + message.sender + ">: "}{message.content}
          </li>
        ))}
      </ul>
      <div className="sticky bottom-2 left-2 w-full">
        <ChatMessageInput username={currentUser.name} />
      </div>
    </div>
  )
}