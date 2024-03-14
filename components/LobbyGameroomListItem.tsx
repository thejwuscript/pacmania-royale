import Link from "next/link";

interface LobbyGameroomListItemProps {
  id: string;
  maxPlayerCount: number;
  currentPlayerCount: number;
}

export default function LobbyGameroomListItem({ id, maxPlayerCount, currentPlayerCount }: LobbyGameroomListItemProps) {
  return (
    <li className="max-w-[400px] flex justify-around items-center">
      <div>
        Game Room #{id}, Players {currentPlayerCount}/{maxPlayerCount}
      </div>
      {currentPlayerCount >= maxPlayerCount ? (
        <div className="italic">Room Full</div>
      ) : (
        <Link href={`/gameroom/${id}`} className="hover:underline underline-offset-2 px-2 py-1">
          Join Room
        </Link>
      )}
    </li>
  );
}
