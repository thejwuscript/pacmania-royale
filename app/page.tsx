'use client'

import { useEffect } from 'react';
import { io } from 'socket.io-client';


export default function Home() {
  useEffect(() => {
    const socket = io('http://localhost:3001');

  }, [])
  return (
    <div>Home page</div>
  );
}
