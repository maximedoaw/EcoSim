"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense, useState, useCallback } from "react"
import { Scene } from "./scene"
import { GameEngine } from "./game-engine"
import { IntroAnimation } from "./intro-animation"
import { MissionBrief } from "./mission-brief"
import { CameraAwareKeyboardControls } from "./camera-aware-keyboard-controls"
import { DirectionalButtons } from "./directional-buttons"
import { Compass } from "./compass"

export function EcoSimUniverse() {
  const [showIntro, setShowIntro] = useState(true)
  const [showMission, setShowMission] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [movement, setMovement] = useState({ x: 0, z: 0 })
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 1, 0])
  const [placedItems, setPlacedItems] = useState<Array<{ position: [number, number, number]; type: string }>>([])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [cameraAngle, setCameraAngle] = useState(0)

  const handleIntroComplete = () => {
    setShowIntro(false)
    setShowMission(true)
  }

  const handleMissionComplete = () => {
    setShowMission(false)
    setGameStarted(true)
  }

  const handleMovement = useCallback((direction: { x: number; z: number }) => {
    setMovement(direction)
  }, [])

  const handlePlayerPositionChange = useCallback((position: [number, number, number]) => {
    setPlayerPosition(position)
  }, [])

  const handleItemPlaced = useCallback((position: [number, number, number], itemType: string) => {
    setPlacedItems((prev) => [...prev, { position, type: itemType }])
    setSelectedItem(null) // Clear selection after placing
  }, [])

  const handleItemSelected = useCallback((itemType: string) => {
    setSelectedItem(itemType)
  }, [])

  const handleCameraAngleChange = useCallback((angle: number) => {
    setCameraAngle(angle)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Canvas
        camera={{ position: [10, 10, 10], fov: 60 }}
        shadows
        className="bg-gradient-to-b from-sky-400 to-sky-200"
        style={{ width: "100vw", height: "100vh" }}
      >
        <Suspense fallback={null}>
          <Scene
            gameStarted={gameStarted}
            movement={movement}
            playerPosition={playerPosition}
            onPlayerPositionChange={handlePlayerPositionChange}
            onItemPlaced={handleItemPlaced}
            selectedItem={selectedItem}
            onCameraAngleChange={handleCameraAngleChange}
          />
          {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
        </Suspense>
      </Canvas>

      {showMission && <MissionBrief onComplete={handleMissionComplete} />}

      {gameStarted && (
        <>
          <GameEngine
            placedItems={placedItems}
            playerPosition={playerPosition}
            onItemSelected={handleItemSelected}
            selectedItem={selectedItem}
          />
          <CameraAwareKeyboardControls 
            onMove={handleMovement} 
            gameStarted={gameStarted} 
            cameraAngle={cameraAngle} 
          />
          <DirectionalButtons 
            onMove={handleMovement} 
            gameStarted={gameStarted} 
            cameraAngle={cameraAngle} 
          />
          <div className="absolute top-4 left-4 z-20">
            <Compass playerPosition={playerPosition} gameStarted={gameStarted} />
          </div>
        </>
      )}
    </div>
  )
}

export { EcoSimUniverse as MinecraftUniverse }