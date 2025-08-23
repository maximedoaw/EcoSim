"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BuildingMenuProps {
  onClose: () => void
}

export function BuildingMenu({ onClose }: BuildingMenuProps) {
  const buildings = [
    { name: "Maison Simple", icon: "🏠", cost: 10 },
    { name: "Maison de Luxe", icon: "🏘️", cost: 25 },
    { name: "Tour de Guet", icon: "🗼", cost: 15 },
    { name: "Moulin", icon: "🏭", cost: 20 },
  ]

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-20">
      <Card className="liquid-glass max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🏗️ Menu de Construction</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {buildings.map((building, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-1 hover:bg-accent/10 bg-transparent"
              >
                <span className="text-2xl">{building.icon}</span>
                <span className="text-xs">{building.name}</span>
                <span className="text-xs text-muted-foreground">{building.cost} 🪙</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
