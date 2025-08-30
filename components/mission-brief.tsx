"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MissionBriefProps {
  onComplete: () => void
}

export function MissionBrief({ onComplete }: MissionBriefProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
      <Card
        className={`max-w-md w-full mx-4 transition-all duration-1000 border-4 border-green-700 bg-green-900/90 text-yellow-200 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          boxShadow: "0 0 15px #00ff00, inset 0 0 20px rgba(0, 0, 0, 0.7)",
          borderImage: "url(\"data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m0 5 5-5m95 95 5-5M5 95 0 100m95-95 5-5' stroke='%23555' fill='none'/%3e%3c/svg%3e\") 25 stretch"
        }}
      >
        <CardHeader className="border-b-4 border-green-700 pb-4">
          <CardTitle className="text-center text-2xl md:text-3xl font-bold text-yellow-300" style={{ textShadow: "2px 2px 0 #000" }}>
            🌍 Green Odyssey: Climate Impact Resolution Game
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <p className="text-center text-yellow-200 text-sm md:text-base" style={{ textShadow: "1px 1px 0 #000" }}>
            Welcome to Green Odyssey! Your mission is to solve problems related to climate change through various challenges.
          </p>
          <div className="space-y-3 text-xs md:text-sm">
            <div className="flex items-center gap-2 p-2 bg-green-800/50 rounded border border-green-700">
              <span className="text-2xl">🌱</span>
              <span>Manage biodiversity and ecosystems</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-800/50 rounded border border-green-700">
              <span className="text-2xl">💨</span>
              <span>Reduce CO₂ emissions</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-800/50 rounded border border-green-700">
              <span className="text-2xl">🌊</span>
              <span>Preserve water resources</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-800/50 rounded border border-green-700">
              <span className="text-2xl">⚡</span>
              <span>Develop sustainable energy</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-800/50 rounded border border-green-700">
              <span className="text-2xl">🌍</span>
              <span>Engage the community</span>
            </div>
          </div>
          <Button 
            onClick={onComplete} 
            className="w-full py-3 text-lg font-bold bg-green-700 hover:bg-green-600 text-yellow-200 border-b-4 border-green-900 hover:border-green-800 rounded-none"
            style={{ textShadow: "1px 1px 0 #000" }}
          >
            Begin the Adventure!
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}