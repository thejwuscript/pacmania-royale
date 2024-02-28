export default function Gameroom({ params }: { params: { id: string } }) {
  return (
    <div>
      Welcome to game room {params.id}
    </div>
  )
}