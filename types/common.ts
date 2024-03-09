export type User = {
  id: string,
  name: string,
}

export type Message = {
  sender?: string,
  content: string,
}

export type Gameroom = {
  id: string,
  maxPlayerCount: number,
  currentPlayerCount: number,
}