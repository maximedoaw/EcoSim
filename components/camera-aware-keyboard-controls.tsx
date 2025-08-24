"use client"

import { useEffect, useState, useRef, useCallback } from "react"

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

  // Utiliser une ref pour onMove pour éviter les dépendances changeantes
  const onMoveRef = useRef(onMove)
  onMoveRef.current = onMove

  // Utiliser une ref pour les keys pour éviter la dépendance dans le useEffect
  const keysRef = useRef(keys)
  keysRef.current = keys

  useEffect(() => {
    if (!gameStarted) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.code as keyof typeof keys
      if (key in keysRef.current) {
        setKeys(prev => ({ ...prev, [key]: true }))
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.code as keyof typeof keys
      if (key in keysRef.current) {
        setKeys(prev => ({ ...prev, [key]: false }))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [gameStarted]) // Retirer la dépendance 'keys'

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

    onMoveRef.current(direction)
  }, [keys, gameStarted, cameraAngle]) // Garder ces dépendances

  return null
}