export default function ConnectedUsersList({ connectedUsers, myUser }) {
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