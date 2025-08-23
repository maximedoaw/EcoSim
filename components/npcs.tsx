"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Box, Text } from "@react-three/drei"
import type * as THREE from "three"

interface NPCsProps {
  playerPosition: [number, number, number]
}

export function NPCs({ playerPosition }: NPCsProps) {
  const npcs = [
    {
      id: 1,
      position: [10, 1, 15],
      color: "#e74c3c",
      dialogue: "Bonjour ! Savez-vous que planter des arbres réduit le CO₂ ?",
    },
    {
      id: 2,
      position: [-20, 1, -10],
      color: "#f39c12",
      dialogue: "Attention ! Cette zone a une forte pollution de l'air.",
    },
    { id: 3, position: [30, 1, -25], color: "#9b59b6", dialogue: "Les énergies renouvelables sont l'avenir !" },
    { id: 4, position: [-15, 1, 35], color: "#1abc9c", dialogue: "Protégeons notre biodiversité ensemble !" },
  ]

  return (
    <>
      {npcs.map((npc) => (
        <NPC
          key={npc.id}
          position={npc.position as [number, number, number]}
          color={npc.color}
          dialogue={npc.dialogue}
          playerPosition={playerPosition}
        />
      ))}
    </>
  )
}

interface NPCProps {
  position: [number, number, number]
  color: string
  dialogue: string
  playerPosition: [number, number, number]
}

function NPC({ position, color, dialogue, playerPosition }: NPCProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [showDialogue, setShowDialogue] = useState(false)
  const [walkDirection, setWalkDirection] = useState({ x: 0, z: 0 })
  const walkTimer = useRef(0)
  const currentPosition = useRef(position)

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Random walking behavior
    walkTimer.current += delta
    if (walkTimer.current > 3) {
      // Change direction every 3 seconds
      setWalkDirection({
        x: (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 0.5,
      })
      walkTimer.current = 0
    }

    // Move NPC
    currentPosition.current[0] += walkDirection.x * delta
    currentPosition.current[2] += walkDirection.z * delta
    groupRef.current.position.set(...currentPosition.current)

    // Check distance to player for dialogue
    const distance = Math.sqrt(
      Math.pow(playerPosition[0] - currentPosition.current[0], 2) +
        Math.pow(playerPosition[2] - currentPosition.current[2], 2),
    )
    setShowDialogue(distance < 5)

    // Simple walking animation
    if (walkDirection.x !== 0 || walkDirection.z !== 0) {
      groupRef.current.rotation.y = Math.atan2(walkDirection.x, walkDirection.z)
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 8) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* NPC Body */}
      <Box args={[0.5, 1, 0.3]} position={[0, 0, 0]} castShadow>
        <meshLambertMaterial color={color} />
      </Box>

      {/* NPC Head */}
      <Box args={[0.4, 0.4, 0.4]} position={[0, 0.7, 0]} castShadow>
        <meshLambertMaterial color="#f4c2a1" />
      </Box>

      {/* Arms */}
      <Box args={[0.2, 0.6, 0.2]} position={[-0.35, -0.1, 0]} castShadow>
        <meshLambertMaterial color={color} />
      </Box>
      <Box args={[0.2, 0.6, 0.2]} position={[0.35, -0.1, 0]} castShadow>
        <meshLambertMaterial color={color} />
      </Box>

      {/* Legs */}
      <Box args={[0.2, 0.6, 0.2]} position={[-0.1, -0.8, 0]} castShadow>
        <meshLambertMaterial color="#2c3e50" />
      </Box>
      <Box args={[0.2, 0.6, 0.2]} position={[0.1, -0.8, 0]} castShadow>
        <meshLambertMaterial color="#2c3e50" />
      </Box>

      {/* Dialogue bubble */}
      {showDialogue && (
        <Text position={[0, 2, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle" maxWidth={4}>
          {dialogue}
        </Text>
      )}
    </group>
  )
}
