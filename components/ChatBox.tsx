interface ChatBoxProps {
  messages: string[]
}

export default function ChatBox({ messages }: ChatBoxProps) {
  return (
    <div>
      <h3>ChatBox</h3>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  )
}