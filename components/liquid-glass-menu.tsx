"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface LiquidGlassMenuProps {
  onToolSelect: (tool: string) => void
  selectedTool: string | null
  canAfford: (tool: string) => boolean
  onClose: () => void
}

export function LiquidGlassMenu({ onToolSelect, selectedTool, canAfford, onClose }: LiquidGlassMenuProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const tools = [
    { id: "arbre", name: "Arbre", emoji: "🌳", cost: 5 },
    { id: "eau", name: "Source d'eau", emoji: "💧", cost: 10 },
    { id: "caillou", name: "Caillou", emoji: "🪨", cost: 2 },
    { id: "maison", name: "Maison", emoji: "🏠", cost: 20 },
    { id: "immeuble", name: "Immeuble", emoji: "🏢", cost: 50 },
    { id: "hache", name: "Hache", emoji: "🪓", cost: 0 },
  ]

  const handleDragStart = (toolId: string) => {
    if (canAfford(toolId) || toolId === "hache") {
      setDraggedItem(toolId)
      // Dispatch custom event for terrain to listen
      window.dispatchEvent(
        new CustomEvent("ecosim-drag-start", {
          detail: { itemType: toolId },
        }),
      )
    }
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    window.dispatchEvent(new CustomEvent("ecosim-drag-end"))
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="absolute top-16 left-4 z-20 md:top-20 md:left-8"
      >
        <div className="liquid-glass p-4 md:p-6 rounded-xl min-w-[280px] md:min-w-[300px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-base md:text-lg">Outils de Construction</h3>
            <button onClick={onClose} className="text-white/70 hover:text-white text-xl">
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-3">
            {tools.map((tool) => (
              <motion.button
                key={tool.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToolSelect(tool.id)}
                draggable={canAfford(tool.id) || tool.id === "hache"}
                onDragStart={() => handleDragStart(tool.id)}
                onDragEnd={handleDragEnd}
                disabled={tool.cost > 0 && !canAfford(tool.id)}
                className={`
                  liquid-glass p-3 md:p-4 rounded-lg text-center transition-all duration-200
                  ${selectedTool === tool.id ? "bg-white/30" : "hover:bg-white/20"}
                  ${draggedItem === tool.id ? "bg-accent/30 scale-105" : ""}
                  ${tool.cost > 0 && !canAfford(tool.id) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                <div className="text-xl md:text-2xl mb-1 md:mb-2">{tool.emoji}</div>
                <div className="text-white text-xs md:text-sm font-medium">{tool.name}</div>
                {tool.cost > 0 && <div className="text-white/70 text-xs mt-1">Coût: {tool.cost} 🪙</div>}
                {(canAfford(tool.id) || tool.id === "hache") && (
                  <div className="text-white/50 text-xs mt-1">Glisser sur le terrain</div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
