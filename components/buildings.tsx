"use client"

import { useState } from "react"

export function Buildings() {
  const [buildings, setBuildings] = useState([
    { x: 5, z: 5, type: "house" },
    { x: -8, z: 3, type: "house" },
  ])

  return (
    <group>
      {buildings.map((building, index) => (
        <Building key={index} position={[building.x, 0, building.z]} type={building.type} />
      ))}
    </group>
  )
}

function Building({ position, type }: { position: [number, number, number]; type: string }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[3, 2, 3]} />
        <meshLambertMaterial color="#d4a574" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[2.2, 1.5, 4]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.5, 1.51]} castShadow>
        <boxGeometry args={[0.8, 1.5, 0.1]} />
        <meshLambertMaterial color="#654321" />
      </mesh>

      {/* Windows */}
      <mesh position={[1, 1, 1.51]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshLambertMaterial color="#87ceeb" />
      </mesh>

      <mesh position={[-1, 1, 1.51]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshLambertMaterial color="#87ceeb" />
      </mesh>
    </group>
  )
}
