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
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <Card
        className={`liquid-glass max-w-md w-full mx-4 transition-all duration-1000 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <CardHeader>
          <CardTitle className="text-center text-xl md:text-2xl font-bold text-primary">
            🌍 EcoSim: Simulateur Écologique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground text-sm md:text-base">
            Bienvenue dans EcoSim ! Votre mission est de créer un écosystème durable tout en maintenant votre EcoScore.
          </p>
          <div className="space-y-2 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <span className="text-accent">🌱</span>
              <span>Gérez la biodiversité et les écosystèmes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent">💨</span>
              <span>Réduisez les émissions de CO₂</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent">🌊</span>
              <span>Préservez les ressources en eau</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent">⚡</span>
              <span>Développez les énergies durables</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent">🌍</span>
              <span>Engagez la communauté</span>
            </div>
          </div>
          <Button onClick={onComplete} className="w-full bg-primary hover:bg-primary/90 text-sm md:text-base">
            Commencer l'Aventure !
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
