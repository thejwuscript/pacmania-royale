export default function LobbyGameroomListLayout({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mt-4 flex flex-col gap-3">
      {children}
    </ul>
  )
}