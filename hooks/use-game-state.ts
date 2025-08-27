"use client"

import { useState, useCallback } from "react"

interface EcoScore {
  total: number
  co2: number // kg CO₂e budget (starts at 10000)
  pollution: number // Water/waste management score
  biodiversity: number // % vegetation coverage
  energy: number // % renewable energy
  community: number // Social engagement score
}

interface GameStats {
  coins: number
  trees: number
  houses: number
  water: number
  rocks: number
  buildings: number
  ecoScore: EcoScore
}

export function useGameState() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [gameStats, setGameStats] = useState<GameStats>({
    coins: 100,
    trees: 20,
    houses: 2,
    water: 2,
    rocks: 15,
    buildings: 0,
    ecoScore: {
      total: 1000,
      co2: 82, // kg CO₂e annual budget
      pollution: 80, // Water quality score
      biodiversity: 60, // % vegetation coverage
      energy: 40, // % renewable energy
      community: 70, // Social engagement
    },
  })

  const costs: Record<string, number> = {
    arbre: 5,
    eau: 10,
    caillou: 2,
    maison: 20,
    immeuble: 50,
    hache: 0,
  }

  const calculateEcoScore = useCallback((ecoData: EcoScore) => {
    const co2Score = Math.max(0, (ecoData.co2 / 10000) * 200) // Max 200 points
    const pollutionScore = (ecoData.pollution / 100) * 200 // Max 200 points
    const biodiversityScore = (ecoData.biodiversity / 100) * 200 // Max 200 points
    const energyScore = (ecoData.energy / 100) * 200 // Max 200 points
    const communityScore = (ecoData.community / 100) * 200 // Max 200 points

    return Math.round(co2Score + pollutionScore + biodiversityScore + energyScore + communityScore)
  }, [])

  const canAfford = useCallback(
    (tool: string) => {
      return gameStats.coins >= (costs[tool] || 0)
    },
    [gameStats.coins],
  )

  const placeItem = useCallback(
    (tool: string, position: [number, number, number]) => {
      const cost = costs[tool] || 0
      if (cost > 0 && !canAfford(tool)) return

      setGameStats((prev) => {
        const newStats = { ...prev }
        const newEcoScore = { ...prev.ecoScore }

        if (cost > 0) {
          newStats.coins -= cost
        }

        switch (tool) {
          case "arbre":
            newStats.trees += 1
            newEcoScore.co2 += 22 // Trees absorb ~22kg CO₂/year
            newEcoScore.biodiversity += 2
            newEcoScore.pollution += 1
            break
          case "eau":
            newStats.water += 1
            newEcoScore.pollution += 5
            newEcoScore.biodiversity += 3
            break
          case "caillou":
            newStats.rocks += 1
            newEcoScore.co2 -= 5 // Mining impact
            break
          case "maison":
            newStats.houses += 1
            newEcoScore.co2 -= 50 // Construction emissions
            newEcoScore.community += 5
            newEcoScore.biodiversity -= 2
            break
          case "immeuble":
            newStats.buildings += 1
            newEcoScore.co2 -= 200 // High construction emissions
            newEcoScore.community += 10
            newEcoScore.biodiversity -= 5
            newEcoScore.energy += 3 // Assume some efficiency
            break
        }

        newEcoScore.total = calculateEcoScore(newEcoScore)
        newStats.ecoScore = newEcoScore

        return newStats
      })

      console.log(`[v0] Placed ${tool} at position:`, position)
    },
    [canAfford, calculateEcoScore],
  )

  const removeItem = useCallback(
    (target: string, position: [number, number, number]) => {
      setGameStats((prev) => {
        const newStats = { ...prev }
        const newEcoScore = { ...prev.ecoScore }

        switch (target) {
          case "tree":
            if (newStats.trees > 0) {
              newStats.trees -= 1
              newStats.coins += 2
              newEcoScore.co2 -= 22 // Lost CO₂ absorption
              newEcoScore.biodiversity -= 2
            }
            break
          case "house":
            if (newStats.houses > 0) {
              newStats.houses -= 1
              newStats.coins += 10
              newEcoScore.community -= 5
              newEcoScore.biodiversity += 2 // Land restored
            }
            break
          case "building":
            if (newStats.buildings > 0) {
              newStats.buildings -= 1
              newStats.coins += 25
              newEcoScore.community -= 10
              newEcoScore.biodiversity += 5 // Land restored
            }
            break
        }

        newEcoScore.total = calculateEcoScore(newEcoScore)
        newStats.ecoScore = newEcoScore

        return newStats
      })

      console.log(`[v0] Removed ${target} at position:`, position)
    },
    [calculateEcoScore],
  )

  return {
    selectedTool,
    setSelectedTool,
    gameStats,
    placeItem,
    removeItem,
    canAfford,
  }
}
