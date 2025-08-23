"use client"

interface DirectionalButtonsProps {
  onMove: (direction: { x: number; z: number }) => void
  gameStarted: boolean
  cameraAngle: number
}

export function DirectionalButtons({ onMove, gameStarted, cameraAngle }: DirectionalButtonsProps) {
  const handleButtonPress = (direction: { x: number; z: number }) => {
    if (!gameStarted) return
    
    // Appliquer la rotation de la caméra à la direction
    const cosAngle = Math.cos(cameraAngle)
    const sinAngle = Math.sin(cameraAngle)
    
    const rotatedDirection = {
      x: direction.x * cosAngle - direction.z * sinAngle,
      z: direction.x * sinAngle + direction.z * cosAngle
    }
    
    onMove(rotatedDirection)
  }

  const handleButtonRelease = () => {
    onMove({ x: 0, z: 0 })
  }

  if (!gameStarted) return null

  return (
    <div className="absolute bottom-4 left-4 z-10">
      <div className="flex flex-col items-center">
        <button
          className="bg-white bg-opacity-50 p-4 rounded-full mb-2"
          onTouchStart={() => handleButtonPress({ x: 0, z: -1 })}
          onTouchEnd={handleButtonRelease}
          onMouseDown={() => handleButtonPress({ x: 0, z: -1 })}
          onMouseUp={handleButtonRelease}
        >
          ↑
        </button>
        <div className="flex">
          <button
            className="bg-white bg-opacity-50 p-4 rounded-full mr-2"
            onTouchStart={() => handleButtonPress({ x: -1, z: 0 })}
            onTouchEnd={handleButtonRelease}
            onMouseDown={() => handleButtonPress({ x: -1, z: 0 })}
            onMouseUp={handleButtonRelease}
          >
            ←
          </button>
          <button
            className="bg-white bg-opacity-50 p-4 rounded-full"
            onTouchStart={() => handleButtonPress({ x: 1, z: 0 })}
            onTouchEnd={handleButtonRelease}
            onMouseDown={() => handleButtonPress({ x: 1, z: 0 })}
            onMouseUp={handleButtonRelease}
          >
            →
          </button>
        </div>
        <button
          className="bg-white bg-opacity-50 p-4 rounded-full mt-2"
          onTouchStart={() => handleButtonPress({ x: 0, z: 1 })}
          onTouchEnd={handleButtonRelease}
          onMouseDown={() => handleButtonPress({ x: 0, z: 1 })}
          onMouseUp={handleButtonRelease}
        >
          ↓
        </button>
      </div>
    </div>
  )
}