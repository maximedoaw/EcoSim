"use client"

interface GameStatsProps {
  stats: {
    coins: number
    trees: number
    houses: number
    water: number
    rocks: number
    buildings: number
    ecoScore: number
    co2Budget: number
    pollution: number
    biodiversity: number
    energy: number
    community: number
  }
  playerPosition: [number, number, number]
}

export function GameStats({ stats, playerPosition }: GameStatsProps) {
  const getEcoScoreColor = (score: number) => {
    if (score >= 800) return "text-green-400"
    if (score >= 600) return "text-yellow-400"
    if (score >= 400) return "text-orange-400"
    return "text-red-400"
  }

  const getParameterColor = (value: number, isReverse = false) => {
    const threshold = isReverse ? 50 : 70
    if (isReverse) {
      if (value <= 30) return "text-green-400"
      if (value <= 60) return "text-yellow-400"
      return "text-red-400"
    } else {
      if (value >= threshold) return "text-green-400"
      if (value >= 40) return "text-yellow-400"
      return "text-red-400"
    }
  }

  return (
    <div className="absolute top-4 right-4 z-10 md:top-6 md:right-6">
      <div className="liquid-glass p-3 md:p-4 rounded-xl max-w-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-sm md:text-base">EcoScore</h3>
          <span className={`font-bold text-lg md:text-xl ${getEcoScoreColor(stats.ecoScore)}`}>{stats.ecoScore}</span>
        </div>

        <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm mb-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-white/80">CO₂ Budget:</span>
            <span className={`font-medium ${getParameterColor(stats.co2Budget)}`}>{stats.co2Budget} kg</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-white/80">🌊 Pollution:</span>
            <span className={`font-medium ${getParameterColor(stats.pollution, true)}`}>{stats.pollution}%</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-white/80">🌱 Biodiversité:</span>
            <span className={`font-medium ${getParameterColor(stats.biodiversity)}`}>{stats.biodiversity}%</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-white/80">⚡ Énergie:</span>
            <span className={`font-medium ${getParameterColor(stats.energy)}`}>{stats.energy}%</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-white/80">🌍 Communauté:</span>
            <span className={`font-medium ${getParameterColor(stats.community)}`}>{stats.community}%</span>
          </div>
        </div>

        <div className="border-t border-white/20 pt-2 md:pt-3">
          <div className="grid grid-cols-2 gap-1.5 md:gap-2 text-xs">
            <div className="flex items-center gap-1">
              <span>🪙</span>
              <span className="text-white font-medium">{stats.coins}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🌳</span>
              <span className="text-white font-medium">{stats.trees}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🏠</span>
              <span className="text-white font-medium">{stats.houses}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🏢</span>
              <span className="text-white font-medium">{stats.buildings}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>💧</span>
              <span className="text-white font-medium">{stats.water}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🪨</span>
              <span className="text-white font-medium">{stats.rocks}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-2 mt-2 text-xs text-white/60">
          Position: ({Math.round(playerPosition[0])}, {Math.round(playerPosition[2])})
        </div>
      </div>
    </div>
  )
}
