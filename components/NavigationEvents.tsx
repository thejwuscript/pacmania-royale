'use client'
 
import { useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
 
export default function NavigationEvents() {
  const pathname = usePathname()
  const prevPathnameRef = useRef("/")

  useEffect(() => {
    if (prevPathnameRef.current.startsWith("/gameroom")) {
      console.log("leaving gameroom")
    }
    prevPathnameRef.current = pathname;
  }, [pathname])
 
  return null
}