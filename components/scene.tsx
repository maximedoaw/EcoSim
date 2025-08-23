"use client"

import { useRef } from "react"
import { Sky } from "@react-three/drei"
import { InfiniteTerrain } from "./infinite-terrain"
import { ExplorerCharacter } from "./explorer-character"
import { NPCs } from "./npcs"
import { CameraController } from "./camera-controller"
import type * as THREE from "three"

interface SceneProps {
  gameStarted: boolean
  movement: { x: number; z: number }
  playerPosition: [number, number, number]
  onPlayerPositionChange?: (position: [number, number, number]) => void
  onItemPlaced?: (position: [number, number, number], itemType: string) => void
  selectedItem?: string | null
  onCameraAngleChange?: (angle: number) => void // Ajouter cette ligne
}

export function Scene({
  gameStarted,
  movement,
  playerPosition,
  onPlayerPositionChange,
  onItemPlaced,
  selectedItem,
  onCameraAngleChange, // Ajouter cette ligne
}: SceneProps) {
  const groupRef = useRef<THREE.Group>(null)

  const handleTerrainClick = (position: [number, number, number]) => {
    console.log("Terrain clicked at:", position)
    if (selectedItem && onItemPlaced) {
      onItemPlaced(position, selectedItem)
    }
  }

  return (
    <>
      <CameraController 
        playerPosition={playerPosition} 
        direction={movement} 
        gameStarted={gameStarted} 
        onCameraAngleChange={onCameraAngleChange} // Ajouter cette ligne
      />
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Environment */}
      <Sky sunPosition={[10, 10, 5]} />
      <fog attach="fog" args={["#87CEEB", 100, 300]} />

      {/* World */}
      <group ref={groupRef}>
        <InfiniteTerrain playerPosition={playerPosition} onTerrainClick={handleTerrainClick} />

        {gameStarted && (
          <ExplorerCharacter position={playerPosition} direction={movement} onPositionChange={onPlayerPositionChange} />
        )}

        {gameStarted && <NPCs playerPosition={playerPosition} />}
      </group>
    </>
  )
}