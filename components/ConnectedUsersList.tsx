import { ConnectedUser } from "@/types/common"

interface ConnectedUsersListProps {
  connectedUsers: ConnectedUser[],
  myUser: ConnectedUser,
}

export default function ConnectedUsersList({ connectedUsers, myUser }: ConnectedUsersListProps) {
  const otherUsers = connectedUsers.filter(user => user.name !== myUser.name)

  return (
    <div>
      <h3>List of Users</h3>
      <ul>
        <li><b>{myUser.name}</b></li>
        {otherUsers.map(user => (
          <li key={user.name}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>)
}