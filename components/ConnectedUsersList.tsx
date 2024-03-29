import { User } from "@/types/common"

interface ConnectedUsersListProps {
  connectedUsers: User[],
  currentUser: User,
}

export default function ConnectedUsersList({ connectedUsers, currentUser }: ConnectedUsersListProps) {
  const otherUsers = connectedUsers.filter(user => user.name !== currentUser.name)

  return (
    <div>
      <h2 className="font-retro mb-2">Players</h2>
      <ul>
        <li><b>{currentUser.name}</b></li>
        {otherUsers.map(user => (
          <li key={user.name}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>)
}