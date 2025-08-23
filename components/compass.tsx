"use client"

interface CompassProps {
  playerPosition: [number, number, number]
  gameStarted: boolean
}

export function Compass({ playerPosition, gameStarted }: CompassProps) {
  if (!gameStarted) return null

  // Calculate environmental threats based on position
  const threats = [
    {
      name: "Usine polluante",
      position: [50, 0, 30],
      type: "pollution",
      distance: Math.sqrt(Math.pow(playerPosition[0] - 50, 2) + Math.pow(playerPosition[2] - 30, 2)),
    },
    {
      name: "Zone déforestation",
      position: [-40, 0, -20],
      type: "deforestation",
      distance: Math.sqrt(Math.pow(playerPosition[0] + 40, 2) + Math.pow(playerPosition[2] + 20, 2)),
    },
    {
      name: "Décharge toxique",
      position: [20, 0, -60],
      type: "toxic",
      distance: Math.sqrt(Math.pow(playerPosition[0] - 20, 2) + Math.pow(playerPosition[2] + 60, 2)),
    },
  ]

  const nearbyThreats = threats.filter((threat) => threat.distance < 100)

  return (
    <div className="fixed top-20 right-4 md:top-24 md:right-8 z-50">
      <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-4">
        {/* Compass background */}
        <div className="relative w-full h-full bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full border-2 border-white/30">
          {/* North indicator */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold">N</div>

          {/* Player position (center) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full border-2 border-white"></div>

          {/* Environmental threats */}
          {nearbyThreats.map((threat, index) => {
            const angle = Math.atan2(threat.position[2] - playerPosition[2], threat.position[0] - playerPosition[0])
            const distance = Math.min(threat.distance / 100, 1) * 40 // Scale to compass size
            const x = Math.cos(angle) * distance
            const z = Math.sin(angle) * distance

            const threatColor =
              threat.type === "pollution"
                ? "bg-red-500"
                : threat.type === "deforestation"
                  ? "bg-orange-500"
                  : "bg-purple-500"

            return (
              <div
                key={index}
                className={`absolute w-2 h-2 ${threatColor} rounded-full transform -translate-x-1/2 -translate-y-1/2`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${z}px)`,
                }}
                title={`${threat.name} (${Math.round(threat.distance)}m)`}
              />
            )
          })}
        </div>

        {/* Position display */}
        <div className="mt-2 text-center text-white text-xs">
          <div>X: {Math.round(playerPosition[0])}</div>
          <div>Z: {Math.round(playerPosition[2])}</div>
        </div>
      </div>
    </div>
  )
}
