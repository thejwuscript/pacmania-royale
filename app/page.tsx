'use client'

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function Home() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const socket = io('http://localhost:3001');

    // socket.on('connect', () => {
    //   const socketId = socket.id;
    //   console.log("Socket ID:", socketId);
    // });

    socket.on("user connected", user => {
      console.log(`User ${user.name} has connected.`)
    })

    socket.on('user data', userData => {
      setUser(userData);
    })

    socket.on("user disconnected", user => {
      console.log(`User ${user.name} has disconnected.`)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div>Home page</div>
  );
}
