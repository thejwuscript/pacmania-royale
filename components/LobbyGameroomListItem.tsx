import Link from "next/link";

interface LobbyGameroomListItemProps {
  id: string;
  maxPlayerCount: number;
  currentPlayerCount: number;
}

export default function LobbyGameroomListItem({ id, maxPlayerCount, currentPlayerCount }: LobbyGameroomListItemProps) {
  return (
    <li className="max-w-[400px] flex justify-around">
      <div>
        Game Room #{id}, Players {currentPlayerCount}/{maxPlayerCount}
      </div>
      <Link href={`/gameroom/${id}`} className="hover:underline underline-offset-2">Join Room</Link>
    </li>
  );
}
