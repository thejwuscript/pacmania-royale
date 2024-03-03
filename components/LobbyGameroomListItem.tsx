interface LobbyGameroomListItemProps {
  id: string,
  maxPlayerCount: number,
  currentPlayerCount: number,
}

export default function LobbyGameroomListItem({id, maxPlayerCount, currentPlayerCount}: LobbyGameroomListItemProps) {
  return (
    <li>
      Game Room id is {id}, Players {currentPlayerCount}/{maxPlayerCount}
    </li>
  )
}