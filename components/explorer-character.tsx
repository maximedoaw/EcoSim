"use client"

import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react"
import { useFrame } from "@react-three/fiber"
import { Box } from "@react-three/drei"
import type * as THREE from "three"

interface ExplorerCharacterProps {
  position: [number, number, number]
  direction: { x: number; z: number }
  onPositionChange?: (position: [number, number, number]) => void
}

export const ExplorerCharacter = forwardRef<THREE.Group, ExplorerCharacterProps>(
  ({ position, direction, onPositionChange }, ref) => {
    const groupRef = useRef<THREE.Group>(null)
    const [isWalking, setIsWalking] = useState(false)
    const walkCycle = useRef(0)
    const currentPosition = useRef(position)
    const lastReportedPosition = useRef(position)

    // Exposer la référence du groupe au composant parent
    useImperativeHandle(ref, () => groupRef.current as THREE.Group)

    useEffect(() => {
      setIsWalking(direction.x !== 0 || direction.z !== 0)
    }, [direction])

    const reportPositionChange = useCallback(() => {
      if (onPositionChange) {
        const pos = currentPosition.current
        const lastPos = lastReportedPosition.current

        // Only report if position changed significantly (avoid micro-movements)
        if (Math.abs(pos[0] - lastPos[0]) > 0.1 || Math.abs(pos[2] - lastPos[2]) > 0.1) {
          onPositionChange([...pos] as [number, number, number])
          lastReportedPosition.current = [...pos] as [number, number, number]
        }
      }
    }, [onPositionChange])

    useFrame((state, delta) => {
      if (!groupRef.current) return

      if (direction.x !== 0 || direction.z !== 0) {
        const speed = 8 * delta
        currentPosition.current[0] += direction.x * speed
        currentPosition.current[2] += direction.z * speed

        groupRef.current.position.set(...currentPosition.current)

        // Update rotation based on movement direction
        if (direction.x !== 0 || direction.z !== 0) {
          groupRef.current.rotation.y = Math.atan2(direction.x, direction.z)
        }

        reportPositionChange()
      }

      if (isWalking) {
        walkCycle.current += delta * 8

        // Simple walking animation - bob up and down
        groupRef.current.position.y = currentPosition.current[1] + Math.sin(walkCycle.current) * 0.1
      }
    })

    return (
      <group ref={groupRef} position={currentPosition.current}>
        {/* Body */}
        <Box args={[0.6, 1.2, 0.4]} position={[0, 0, 0]} castShadow>
          <meshLambertMaterial color="#4a90e2" />
        </Box>

        {/* Head */}
        <Box args={[0.5, 0.5, 0.5]} position={[0, 0.85, 0]} castShadow>
          <meshLambertMaterial color="#f4c2a1" />
        </Box>

        {/* Arms */}
        <Box args={[0.3, 0.8, 0.3]} position={[-0.45, -0.1, 0]} castShadow>
          <meshLambertMaterial color="#4a90e2" />
        </Box>
        <Box args={[0.3, 0.8, 0.3]} position={[0.45, -0.1, 0]} castShadow>
          <meshLambertMaterial color="#4a90e2" />
        </Box>

        {/* Legs */}
        <Box args={[0.25, 0.8, 0.3]} position={[-0.15, -1, 0]} castShadow>
          <meshLambertMaterial color="#2c3e50" />
        </Box>
        <Box args={[0.25, 0.8, 0.3]} position={[0.15, -1, 0]} castShadow>
          <meshLambertMaterial color="#2c3e50" />
        </Box>

        {/* Simple face */}
        <Box args={[0.1, 0.1, 0.1]} position={[-0.1, 0.9, 0.26]} castShadow>
          <meshLambertMaterial color="#000" />
        </Box>
        <Box args={[0.1, 0.1, 0.1]} position={[0.1, 0.9, 0.26]} castShadow>
          <meshLambertMaterial color="#000" />
        </Box>
      </group>
    )
  }
)

ExplorerCharacter.displayName = "ExplorerCharacter"