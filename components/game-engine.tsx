"use client"

import { useState, useCallback } from "react"
import { LiquidGlassMenu } from "./liquid-glass-menu"
import { GameStats } from "./game-stats"
import { Compass } from "./compass"
import { useGameState } from "../hooks/use-game-state"
import { EnvironmentType } from "@/types"
import { EnvironmentSelector } from "./environment-selector"

interface GameEngineProps {
  placedItems: Array<{ position: [number, number, number]; type: string }>
  playerPosition: [number, number, number]
  onItemSelected?: (itemType: string) => void
  selectedItem?: string | null
}

export function GameEngine({ placedItems, playerPosition, onItemSelected, selectedItem }: GameEngineProps) {
  const { selectedTool, setSelectedTool, gameStats, placeItem, removeItem, canAfford } = useGameState()
  const [currentEnvironment, setCurrentEnvironment] = useState<EnvironmentType>("burnedForest")
  const [showMenu, setShowMenu] = useState(false)
  const [showEcoScore, setShowEcoScore] = useState(false)

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

  // Données pour l'EcoScore - corrigées pour être cohérentes
  const ecoScoreData = [
    {
      id: "co2",
      name: "CO₂ Budget",
      value: gameStats.ecoScore.co2,
      max: 200,
      icon: "🌍",
      description: "Émissions de gaz à effet de serre",
      unit: "kg CO₂e/an",
      currentBudget: Math.round((gameStats.ecoScore.co2 / 200) * 10000),
      maxBudget: 10000
    },
    {
      id: "pollution",
      name: "Pollution",
      value: gameStats.ecoScore.pollution,
      max: 200,
      icon: "🌊",
      description: "Gestion des déchets et ressources",
      unit: "points",
      details: "Eau, déchets, microplastiques"
    },
    {
      id: "biodiversity",
      name: "Biodiversité",
      value: gameStats.ecoScore.biodiversity,
      max: 200,
      icon: "🌱",
      description: "Protection des écosystèmes",
      unit: "points",
      details: "Couverture végétale, espèces protégées"
    },
    {
      id: "energy",
      name: "Énergie",
      value: gameStats.ecoScore.energy,
      max: 200,
      icon: "⚡",
      description: "Production et consommation durable",
      unit: "kWh",
      details: "% énergies renouvelables"
    },
    {
      id: "community",
      name: "Communauté",
      value: gameStats.ecoScore.community,
      max: 200,
      icon: "👥",
      description: "Engagement social et collaboration",
      unit: "points",
      details: "Sensibilisation, actions collectives"
    }
  ]

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
      {/* --- Bouton Menu (haut gauche) --- */}
      <div className="absolute top-4 left-4 z-30 md:top-6 md:left-6">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="
            px-4 py-2 md:px-5 md:py-2
            bg-gradient-to-br from-green-700 to-green-500
            text-white font-bold
            border-2 border-white/20
            rounded-md shadow-md
            hover:from-green-600 hover:to-green-400
            hover:shadow-lg hover:scale-105
            active:scale-95
            transition-all duration-200
            pixel-font
          "
        >
          🍃 Menu
        </button>
      </div>

      <div className="absolute top-20 left-4 z-30 md:top-24 md:left-6">
        <EnvironmentSelector />
      </div>


      {/* --- Bouton EcoScore (haut droit) --- */}
      <div className="absolute top-4 right-4 z-30 md:top-6 md:right-6">
        <button
          onClick={() => setShowEcoScore(!showEcoScore)}
          className="
            px-4 py-2 md:px-5 md:py-2
            bg-gradient-to-br from-slate-700 to-slate-600
            text-white font-bold
            border-2 border-white/20
            rounded-md shadow-md
            hover:from-slate-600 hover:to-slate-500
            hover:shadow-lg hover:scale-105
            active:scale-95
            transition-all duration-200
            pixel-font
          "
        >
          🌱 EcoScore
        </button>
      </div>

      {/* Menu latéral - ouvre à gauche */}
      {showMenu && (
        <div className="absolute top-20 left-4 z-40 md:top-24 md:left-6">
          <LiquidGlassMenu
            onToolSelect={handleToolSelect}
            selectedTool={selectedItem || selectedTool}
            canAfford={canAfford}
            onClose={() => setShowMenu(false)}
          />
        </div>
      )}

      {/* Panel EcoScore - ouvre à droite */}
      {showEcoScore && (
        <div className="absolute top-20 right-4 z-40 md:top-24 md:right-6 w-80 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-xl p-4 border-2 border-white/20 shadow-2xl max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-lg font-bold">🌍 EcoScore Global</h3>
            <button 
              onClick={() => setShowEcoScore(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <span className="text-white/80">Score Total</span>
              <span className="text-2xl font-bold text-green-400">{gameStats.ecoScore.total}/1000</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-300 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(gameStats.ecoScore.total / 1000) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {ecoScoreData.map((item : any) => (
              <div key={item.id} className="bg-black/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <h4 className="text-white font-medium text-sm">{item.name}</h4>
                      <p className="text-white/60 text-xs">{item.description}</p>
                    </div>
                  </div>
                  <span className="text-white font-bold">{item.value}/{item.max}</span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      item.value > 150 ? 'bg-green-500' :
                      item.value > 100 ? 'bg-yellow-500' :
                      item.value > 50 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(item.value / item.max) * 100}%` }}
                  />
                </div>
                
                {item.id === "co2" && (
                  <div className="mt-2 text-xs text-white/70">
                    Budget: {item.currentBudget.toLocaleString()} / {item.maxBudget.toLocaleString()} {item.unit}
                  </div>
                )}
                
                {item.details && (
                  <div className="mt-1 text-xs text-white/60">
                    {item.details}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-black/40 rounded-lg">
            <h4 className="text-white font-medium mb-2 text-sm">📊 Impact de vos actions</h4>
            <div className="text-xs text-white/70 space-y-1">
              <div>🌳 Arbre planté: +5 pts CO₂</div>
              <div>🏠 Maison écologique: +30 pts</div>
              <div>🪓 Déforestation: -100 pts</div>
              <div>☀️ Panneau solaire: +20 pts Énergie</div>
            </div>
          </div>
        </div>
      )}

      {/* --- Compass (bas gauche) --- */}
      <div className="absolute bottom-4 left-4 z-20 md:bottom-6 md:left-6">
        <div className="liquid-glass rounded-xl p-2 border-2 border-white/20 shadow-lg">
          <Compass playerPosition={playerPosition} gameStarted={true} />
        </div>
      </div>

      {/* --- Outil sélectionné (bas centre) --- */}
      {selectedItem && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 md:bottom-28">
          <div className="liquid-glass px-3 py-2 md:px-4 md:py-2 rounded-lg text-white font-medium text-sm md:text-base">
            Outil sélectionné: {getToolEmoji(selectedItem)} {getToolName(selectedItem)}
          </div>
        </div>
      )}

      {/* --- Aide outils (bas droit) --- */}
      <div className="absolute bottom-4 right-4 z-20 md:bottom-6 md:right-6">
        <div className="liquid-glass px-3 py-2 rounded-lg text-white/80 text-xs md:text-sm">
          💡 Sélectionnez un outil puis cliquez sur le terrain pour le placer
        </div>
      </div>

      {/* --- Instructions déplacement (juste au-dessus, centre bas) --- */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 md:bottom-16">
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