import { User } from "@/types/common"

interface ConnectedUsersListProps {
  connectedUsers: User[],
  currentUser: User,
}

export default function ConnectedUsersList({ connectedUsers, currentUser }: ConnectedUsersListProps) {
  const otherUsers = connectedUsers.filter(user => user.name !== currentUser.name)

  return (
    <div className="col-start-2 col-span-1 row-span-3">
      <h3>List of Users</h3>
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