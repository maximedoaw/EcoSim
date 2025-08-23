"use client"

import { useMemo } from "react"

export function Villages() {
  const villages = useMemo(() => {
    const villagePositions = [
      { x: -25, z: -25, size: "large" },
      { x: 30, z: -20, size: "medium" },
      { x: -15, z: 35, size: "small" },
      { x: 20, z: 25, size: "medium" },
      { x: -35, z: 10, size: "small" },
    ]

    return villagePositions
  }, [])

  const createBuilding = (x: number, z: number, width: number, height: number, depth: number, color: string) => (
    <group position={[x, height / 2, z]} key={`${x}-${z}`}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, height / 2 + 0.3, 0]} castShadow>
        <coneGeometry args={[width * 0.7, 0.6, 4]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
    </group>
  )

  const createVillage = (centerX: number, centerZ: number, size: string) => {
    const buildings = []
    const buildingCount = size === "large" ? 12 : size === "medium" ? 8 : 5
    const radius = size === "large" ? 8 : size === "medium" ? 6 : 4

    for (let i = 0; i < buildingCount; i++) {
      const angle = (i / buildingCount) * Math.PI * 2
      const x = centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 2
      const z = centerZ + Math.sin(angle) * radius + (Math.random() - 0.5) * 2
      const width = 1.5 + Math.random() * 1
      const height = 2 + Math.random() * 2
      const depth = 1.5 + Math.random() * 1
      const colors = ["#D2B48C", "#F5DEB3", "#DEB887", "#CD853F"]
      const color = colors[Math.floor(Math.random() * colors.length)]

      buildings.push(createBuilding(x, z, width, height, depth, color))
    }

    return buildings
  }

  return (
    <group>
      {villages.map((village, index) => (
        <group key={index}>{createVillage(village.x, village.z, village.size)}</group>
      ))}
    </group>
  )
}
