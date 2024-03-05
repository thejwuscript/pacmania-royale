"use client";

import { useRef, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";
import { SocketContext } from "@/components/SocketProvider";

export default function NavigationEvents() {
  const socket = useContext(SocketContext);
  const pathname = usePathname();
  const prevPathnameRef = useRef("/");

  useEffect(() => {
    if (prevPathnameRef.current.startsWith("/gameroom")) {
      const gameroomId = prevPathnameRef.current.split("/")[2];
      socket.emit("leave gameroom", gameroomId);
    }
    prevPathnameRef.current = pathname;
  }, [pathname]);

  return null;
}
