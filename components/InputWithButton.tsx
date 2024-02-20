import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface InputWithButtonProps {
  onSubmit: React.FormEventHandler
  onChange: React.ChangeEventHandler
  message: string
}

export function InputWithButton({ onSubmit, onChange, message }: InputWithButtonProps) {
  return (
    <form className="flex w-full max-w-sm items-center space-x-2" onSubmit={onSubmit}>
      <Input type="text" placeholder="Type a message..." onChange={onChange} value={message} />
      <Button type="submit">Send</Button>
    </form>
  )
}
