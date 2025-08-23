"use client"

import React from "react"
import { useState, useRef, useCallback } from "react"

interface JoystickProps {
  onMove?: (deltaX: number, deltaY: number) => void
  onInteraction?: (position: [number, number, number], target?: string) => void
}

export function Joystick({ onMove, onInteraction }: JoystickProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const joystickRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !joystickRef.current) return

      const rect = joystickRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const maxDistance = 40

      let newX, newY
      if (distance <= maxDistance) {
        newX = deltaX
        newY = deltaY
      } else {
        const angle = Math.atan2(deltaY, deltaX)
        newX = Math.cos(angle) * maxDistance
        newY = Math.sin(angle) * maxDistance
      }

      setPosition({ x: newX, y: newY })

      if (onMove) {
        onMove(newX * 0.001, newY * 0.001)
      }
    },
    [isDragging, onMove],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setPosition({ x: 0, y: 0 })
    if (onMove) {
      onMove(0, 0)
    }
  }, [onMove])

  const handleDoubleClick = useCallback(() => {
    if (onInteraction) {
      const interactionPos: [number, number, number] = [0, 0, 0]
      onInteraction(interactionPos)
    }
  }, [onInteraction])

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div className="absolute bottom-4 left-4 z-10 md:bottom-8 md:left-8">
      <div
        ref={joystickRef}
        className="relative w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full border-2 border-white/30 backdrop-blur-sm cursor-pointer"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <div
          className="absolute w-6 h-6 md:w-8 md:h-8 bg-accent rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
          }}
        />
      </div>
      <div className="text-center mt-2 text-xs text-white/80">
        Joystick
        <br />
        <span className="text-xs text-white/60">Double-clic pour interagir</span>
      </div>
    </div>
  )
}
