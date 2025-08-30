"use client"

import { useState, useCallback } from "react"

export interface EcoScore {
  total: number
  co2: number
  pollution: number
  biodiversity: number
  energy: number
  community: number
  water: number
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

interface ToolImpact {
  co2: number;
  pollution: number;
  biodiversity: number;
  energy: number;
  community: number;
  water: number;
}

export function useGameState() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [gameStats, setGameStats] = useState<GameStats>({
    coins: 5000,
    trees: 20,
    houses: 2,
    water: 2,
    rocks: 15,
    buildings: 0,
    ecoScore: {
      total: 407,
      co2: 82,
      pollution: 80,
      biodiversity: 60,
      energy: 40,
      community: 70,
      water: 75
    }
  });

  const costs: Record<string, number> = {
    arbre: 5,
    eau: 10,
    caillou: 2,
    maison: 20,
    immeuble: 50,
    hache: 0,
    // Équipements environnementaux
    "Kit de plantation": 120,
    "Sacs de graines": 80,
    "Système d'irrigation": 350,
    "Serre communautaire": 2000,
    "Clôture de protection": 200,
    "Panneaux solaires": 1500,
    "Vélo électrique": 800,
    "Éolienne urbaine": 2500,
    "Station de recharge": 1200,
    "Toit vert": 1800,
    "Capteur de température": 60,
    "Station météo": 80,
    "Reflecteur solaire": 50,
    "Drone de surveillance": 110,
    "Laboratoire mobile": 130,
    "Serre désertique": 90,
    "Plante résistante": 40,
    "Récupérateur d'eau": 60,
    "Barrière anti-érosion": 55,
    "Filet de nettoyage": 40,
    "Bateau écologique": 100,
    "Capteur de pH": 70,
    "Récif artificiel": 120,
    "Station d'épuration": 150,
    // Équipements gratuits
    "Kit éducatif": 0,
    "Application mobile": 0
  }

  const calculateEcoScore = useCallback((ecoData: EcoScore) => {
    const co2Score = Math.max(0, (ecoData.co2 / 200) * 200)
    const pollutionScore = (ecoData.pollution / 200) * 200
    const biodiversityScore = (ecoData.biodiversity / 200) * 200
    const energyScore = (ecoData.energy / 200) * 200
    const communityScore = (ecoData.community / 200) * 200
    const waterScore = (ecoData.water / 200) * 200

    return Math.round((co2Score + pollutionScore + biodiversityScore + energyScore + communityScore + waterScore) / 6)
  }, [])

  const canAfford = useCallback(
    (tool: string) => {
      return gameStats.coins >= (costs[tool] || 0)
    },
    [gameStats.coins],
  )

  const updateEcoScore = useCallback((impact: ToolImpact) => {
    setGameStats(prev => {
      const newStats = { ...prev }
      const newEcoScore = { ...prev.ecoScore }
      
      newEcoScore.co2 = Math.max(0, Math.min(200, newEcoScore.co2 + impact.co2))
      newEcoScore.pollution = Math.max(0, Math.min(200, newEcoScore.pollution + impact.pollution))
      newEcoScore.biodiversity = Math.max(0, Math.min(200, newEcoScore.biodiversity + impact.biodiversity))
      newEcoScore.energy = Math.max(0, Math.min(200, newEcoScore.energy + impact.energy))
      newEcoScore.community = Math.max(0, Math.min(200, newEcoScore.community + impact.community))
      newEcoScore.water = Math.max(0, Math.min(200, newEcoScore.water + impact.water))
      
      newEcoScore.total = calculateEcoScore(newEcoScore)
      newStats.ecoScore = newEcoScore
      
      return newStats
    })
  }, [calculateEcoScore])

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
            newEcoScore.co2 = Math.min(200, newEcoScore.co2 + 5)
            newEcoScore.biodiversity = Math.min(200, newEcoScore.biodiversity + 2)
            newEcoScore.pollution = Math.min(200, newEcoScore.pollution + 1)
            break
          case "eau":
            newStats.water += 1
            newEcoScore.pollution = Math.min(200, newEcoScore.pollution + 5)
            newEcoScore.biodiversity = Math.min(200, newEcoScore.biodiversity + 3)
            newEcoScore.water = Math.min(200, newEcoScore.water + 8)
            break
          case "caillou":
            newStats.rocks += 1
            newEcoScore.co2 = Math.max(0, newEcoScore.co2 - 5)
            break
          case "maison":
            newStats.houses += 1
            newEcoScore.co2 = Math.max(0, newEcoScore.co2 - 10)
            newEcoScore.community = Math.min(200, newEcoScore.community + 5)
            newEcoScore.biodiversity = Math.max(0, newEcoScore.biodiversity - 2)
            break
          case "immeuble":
            newStats.buildings += 1
            newEcoScore.co2 = Math.max(0, newEcoScore.co2 - 20)
            newEcoScore.community = Math.min(200, newEcoScore.community + 10)
            newEcoScore.biodiversity = Math.max(0, newEcoScore.biodiversity - 5)
            newEcoScore.energy = Math.min(200, newEcoScore.energy + 3)
            break
        }

        newEcoScore.total = calculateEcoScore(newEcoScore)
        newStats.ecoScore = newEcoScore

        return newStats
      })

      console.log(`Placed ${tool} at position:`, position)
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
              newEcoScore.co2 = Math.max(0, newEcoScore.co2 - 5)
              newEcoScore.biodiversity = Math.max(0, newEcoScore.biodiversity - 2)
            }
            break
          case "house":
            if (newStats.houses > 0) {
              newStats.houses -= 1
              newStats.coins += 10
              newEcoScore.community = Math.max(0, newEcoScore.community - 5)
              newEcoScore.biodiversity = Math.min(200, newEcoScore.biodiversity + 2)
            }
            break
          case "building":
            if (newStats.buildings > 0) {
              newStats.buildings -= 1
              newStats.coins += 25
              newEcoScore.community = Math.max(0, newEcoScore.community - 10)
              newEcoScore.biodiversity = Math.min(200, newEcoScore.biodiversity + 5)
            }
            break
        }

        newEcoScore.total = calculateEcoScore(newEcoScore)
        newStats.ecoScore = newEcoScore

        return newStats
      })

      console.log(`Removed ${target} at position:`, position)
    },
    [calculateEcoScore],
  )

  const addCoins = useCallback((amount: number) => {
    setGameStats(prev => ({
      ...prev,
      coins: prev.coins + amount
    }))
  }, [])

  return {
    selectedTool,
    setSelectedTool,
    gameStats,
    placeItem,
    removeItem,
    canAfford,
    updateEcoScore,
    addCoins
  }
}