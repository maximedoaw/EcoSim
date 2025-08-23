"use client"

import { useEffect, useState } from "react"

interface KeyboardControlsProps {
  onMove: (direction: { x: number; z: number }) => void
  gameStarted: boolean
}

export function KeyboardControls({ onMove, gameStarted }: KeyboardControlsProps) {
  const [keys, setKeys] = useState({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    KeyW: false,
    KeyS: false,
    KeyA: false,
    KeyD: false,
  })

  useEffect(() => {
    if (!gameStarted) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code in keys) {
        setKeys((prev) => ({ ...prev, [event.code]: true }))
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code in keys) {
        setKeys((prev) => ({ ...prev, [event.code]: false }))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [gameStarted])

  useEffect(() => {
    if (!gameStarted) return

    const direction = { x: 0, z: 0 }

    if (keys.ArrowUp || keys.KeyW) direction.z -= 1
    if (keys.ArrowDown || keys.KeyS) direction.z += 1
    if (keys.ArrowLeft || keys.KeyA) direction.x -= 1
    if (keys.ArrowRight || keys.KeyD) direction.x += 1

    onMove(direction)
  }, [keys, onMove, gameStarted])

  return null
}
