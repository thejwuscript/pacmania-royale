import Link from "next/link"

interface LobbyGameroomListItemProps {
  id: string,
  maxPlayerCount: number,
  currentPlayerCount: number,
}

export default function LobbyGameroomListItem({id, maxPlayerCount, currentPlayerCount}: LobbyGameroomListItemProps) {
  return (
    <Link href={`/gameroom/${id}`}>
      <li>
        Game Room id is {id}, Players {currentPlayerCount}/{maxPlayerCount}
      </li>
    </Link>
  )
}