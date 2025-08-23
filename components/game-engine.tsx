"use client"

import { useState, useCallback } from "react"
import { LiquidGlassMenu } from "./liquid-glass-menu"
import { GameStats } from "./game-stats"
import { useGameState } from "../hooks/use-game-state"

interface GameEngineProps {
  placedItems: Array<{ position: [number, number, number]; type: string }>
  playerPosition: [number, number, number]
  onItemSelected?: (itemType: string) => void
  selectedItem?: string | null
}

export function GameEngine({ placedItems, playerPosition, onItemSelected, selectedItem }: GameEngineProps) {
  const { selectedTool, setSelectedTool, gameStats, placeItem, removeItem, canAfford } = useGameState()

  const [showMenu, setShowMenu] = useState(false)

  const handleToolSelect = useCallback(
    (tool: string) => {
      setSelectedTool(tool)
      if (onItemSelected) {
        onItemSelected(tool)
      }
      setShowMenu(false)
    },
    [setSelectedTool, onItemSelected],
  )

  const handleInteraction = useCallback(
    (position: [number, number, number], target?: string) => {
      if (selectedTool === "hache" && target) {
        removeItem(target, position)
      } else if (selectedTool !== "hache" && selectedTool !== null) {
        placeItem(selectedTool, position)
      }
    },
    [selectedTool, placeItem, removeItem],
  )

  const transformedStats = {
    coins: gameStats.coins,
    trees: gameStats.trees,
    houses: gameStats.houses,
    water: gameStats.water,
    rocks: gameStats.rocks,
    buildings: gameStats.buildings,
    ecoScore: gameStats.ecoScore.total,
    co2Budget: gameStats.ecoScore.co2,
    pollution: gameStats.ecoScore.pollution,
    biodiversity: gameStats.ecoScore.biodiversity,
    energy: gameStats.ecoScore.energy,
    community: gameStats.ecoScore.community,
  }

  return (
    <>
      {/* Main Menu Button */}
      <div className="absolute top-4 right-4 z-10 md:top-6 md:right-6">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="liquid-glass px-3 py-2 md:px-4 md:py-2 rounded-lg text-white font-medium hover:bg-white/20 transition-all duration-200 text-sm md:text-base"
        >
          🛠️ Menu
        </button>
      </div>

      {/* Liquid Glass Menu */}
      {showMenu && (
        <LiquidGlassMenu
          onToolSelect={handleToolSelect}
          selectedTool={selectedItem || selectedTool}
          canAfford={canAfford}
          onClose={() => setShowMenu(false)}
        />
      )}

      {/* Game Stats */}
      <GameStats stats={transformedStats} playerPosition={playerPosition} />

      {/* Selected Tool Indicator */}
      {selectedItem && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10 md:bottom-20">
          <div className="liquid-glass px-3 py-2 md:px-4 md:py-2 rounded-lg text-white font-medium text-sm md:text-base">
            Outil sélectionné: {getToolEmoji(selectedItem)} {getToolName(selectedItem)}
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 z-10 md:bottom-6 md:right-6">
        <div className="liquid-glass px-3 py-2 rounded-lg text-white/80 text-xs md:text-sm">
          💡 Sélectionnez un outil puis cliquez sur le terrain pour le placer
        </div>
      </div>

      {/* Movement instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 md:bottom-6">
        <div className="liquid-glass px-3 py-2 rounded-lg text-white/80 text-xs md:text-sm">
          ⌨️ Utilisez les flèches ou WASD pour vous déplacer
        </div>
      </div>
    </>
  )
}

function getToolEmoji(tool: string): string {
  const emojis: Record<string, string> = {
    arbre: "🌳",
    eau: "💧",
    caillou: "🪨",
    maison: "🏠",
    immeuble: "🏢",
    hache: "🪓",
  }
  return emojis[tool] || "🛠️"
}

function getToolName(tool: string): string {
  const names: Record<string, string> = {
    arbre: "Arbre",
    eau: "Source d'eau",
    caillou: "Caillou",
    maison: "Maison",
    immeuble: "Immeuble",
    hache: "Hache",
  }
  return names[tool] || tool
}
