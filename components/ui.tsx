"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BuildingMenu } from "./building-menu"

export function UI() {
  const [showBuildingMenu, setShowBuildingMenu] = useState(false)

  return (
    <>
      {/* Top UI */}
      <div className="absolute top-4 left-4 z-10">
        <Card className="liquid-glass">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Button onClick={() => setShowBuildingMenu(!showBuildingMenu)} className="bg-primary hover:bg-primary/90">
                🏗️ Construire
              </Button>
              <Button variant="secondary">🌳 Planter</Button>
              <Button variant="secondary">💧 Eau</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Building Menu */}
      {showBuildingMenu && <BuildingMenu onClose={() => setShowBuildingMenu(false)} />}

      {/* Info Panel */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="liquid-glass">
          <CardContent className="p-4">
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-accent">🏠</span>
                <span>Maisons: 2</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent">🌳</span>
                <span>Arbres: 20</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent">💧</span>
                <span>Sources: 2</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
