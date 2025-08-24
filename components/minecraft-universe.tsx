"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense, useState, useCallback, useRef, useMemo } from "react"
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
  
  const cameraAngleRef = useRef(0)
  const setMovementRef = useRef(setMovement)
  setMovementRef.current = setMovement

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false)
    setShowMission(true)
  }, [])

  const handleMissionComplete = useCallback(() => {
    setShowMission(false)
    setGameStarted(true)
  }, [])

  const handleMovement = useCallback((direction: { x: number; z: number }) => {
    setMovementRef.current(direction)
  }, [])

  const handlePlayerPositionChange = useCallback((position: [number, number, number]) => {
    setPlayerPosition(position)
  }, [])

  const handleItemPlaced = useCallback((position: [number, number, number], itemType: string) => {
    setPlacedItems((prev) => [...prev, { position, type: itemType }])
    setSelectedItem(null)
  }, [])

  const handleItemSelected = useCallback((itemType: string) => {
    setSelectedItem(itemType)
  }, [])

  const handleCameraAngleChange = useCallback((angle: number) => {
    cameraAngleRef.current = angle
  }, [])

  const sceneProps = useMemo(() => ({
    gameStarted,
    movement,
    playerPosition,
    onPlayerPositionChange: handlePlayerPositionChange,
    onItemPlaced: handleItemPlaced,
    selectedItem,
    onCameraAngleChange: handleCameraAngleChange
  }), [gameStarted, movement, playerPosition, handlePlayerPositionChange, handleItemPlaced, selectedItem, handleCameraAngleChange])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Canvas
        camera={{ position: [10, 10, 10], fov: 60 }}
        shadows
        className="bg-gradient-to-b from-sky-400 to-sky-200"
        style={{ width: "100vw", height: "100vh" }}
        gl={{
          antialias: false,
          powerPreference: "high-performance"
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <Scene {...sceneProps} />
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

          {/* Contrôles clavier invisibles */}
          <CameraAwareKeyboardControls 
            onMove={handleMovement} 
            gameStarted={gameStarted} 
            cameraAngle={cameraAngleRef.current} 
          />

          {/* Boutons directionnels (en bas à droite) */}
          <div className="absolute bottom-4 right-4 z-20">
            <DirectionalButtons 
              onMove={handleMovement} 
              gameStarted={gameStarted} 
              cameraAngle={cameraAngleRef.current} 
            />
          </div>
        </>
      )}
    </div>
  )
}

export { EcoSimUniverse as MinecraftUniverse }
