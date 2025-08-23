"use client"

import { useEffect, useState } from "react"

interface CameraAwareKeyboardControlsProps {
  onMove: (direction: { x: number; z: number }) => void
  gameStarted: boolean
  cameraAngle: number
}

export function CameraAwareKeyboardControls({ onMove, gameStarted, cameraAngle }: CameraAwareKeyboardControlsProps) {
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
  }, [gameStarted, keys])

  useEffect(() => {
    if (!gameStarted) return

    let direction = { x: 0, z: 0 }

    // Appliquer la rotation de la caméra aux directions
    const cosAngle = Math.cos(cameraAngle)
    const sinAngle = Math.sin(cameraAngle)

    if (keys.ArrowUp || keys.KeyW) {
      // Avancer (par rapport à la caméra)
      direction.z -= cosAngle
      direction.x -= sinAngle
    }
    if (keys.ArrowDown || keys.KeyS) {
      // Reculer (par rapport à la caméra)
      direction.z += cosAngle
      direction.x += sinAngle
    }
    if (keys.ArrowLeft || keys.KeyA) {
      // Gauche (par rapport à la caméra)
      direction.x -= cosAngle
      direction.z += sinAngle
    }
    if (keys.ArrowRight || keys.KeyD) {
      // Droite (par rapport à la caméra)
      direction.x += cosAngle
      direction.z -= sinAngle
    }

    // Normaliser la direction si on appuie sur plusieurs touches
    const length = Math.sqrt(direction.x * direction.x + direction.z * direction.z)
    if (length > 0) {
      direction.x /= length
      direction.z /= length
    }

    onMove(direction)
  }, [keys, onMove, gameStarted, cameraAngle])

  return null
}