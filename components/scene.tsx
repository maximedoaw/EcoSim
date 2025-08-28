"use client"

import { useRef, forwardRef, useImperativeHandle } from "react"
import { Sky } from "@react-three/drei"
import { InfiniteTerrain } from "./infinite-terrain"
import { ExplorerCharacter } from "./explorer-character"
import { NPCs } from "./npcs"
import { CameraController } from "./camera-controller"
import type * as THREE from "three"
import { EnvironmentType } from "@/types"
import { useEnvironment } from "@/hooks/use-select-environment"

interface SceneProps {
  gameStarted: boolean
  movement: { x: number; z: number }
  playerPosition: [number, number, number]
  onPlayerPositionChange?: (position: [number, number, number]) => void
  onItemPlaced?: (position: [number, number, number], itemType: string) => void
  selectedItem?: string | null
  onCameraAngleChange?: (angle: number) => void 
  currentEnvironment: EnvironmentType 
}

// Créer une référence forwardée pour le composant Scene
const SceneComponent = forwardRef<THREE.Group, SceneProps>(({
  gameStarted,
  movement,
  playerPosition,
  onPlayerPositionChange,
  onItemPlaced,
  selectedItem,
  onCameraAngleChange, 
}: SceneProps, ref) => {
  const groupRef = useRef<THREE.Group>(null)
  const playerRef = useRef<THREE.Group>(null)
  const { currentEnvironment } = useEnvironment()

  // Exposer la référence du joueur au composant parent
  useImperativeHandle(ref, () => playerRef.current as THREE.Group)

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
        onCameraAngleChange={onCameraAngleChange}
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
        <InfiniteTerrain 
          playerPosition={playerPosition} 
          onTerrainClick={handleTerrainClick}         
          currentEnvironment={currentEnvironment}
          playerRef={playerRef} // Passer la référence du joueur
        />

        {gameStarted && (
          <ExplorerCharacter 
            position={playerPosition} 
            direction={movement} 
            onPositionChange={onPlayerPositionChange}
            ref={playerRef} // Passer la référence au personnage
          />
        )}

        {gameStarted && <NPCs playerPosition={playerPosition} />}
      </group>
    </>
  )
})

SceneComponent.displayName = "Scene"

export { SceneComponent as Scene }