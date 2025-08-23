"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

export function WaterSources() {
  return (
    <group>
      <WaterSource position={[-10, 0, -10]} />
      <WaterSource position={[12, 0, -8]} />
    </group>
  )
}

function WaterSource({ position }: { position: [number, number, number] }) {
  const waterRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 - 0.3
    }
  })

  return (
    <group position={position}>
      {/* Water */}
      <mesh ref={waterRef} position={[0, -0.3, 0]}>
        <cylinderGeometry args={[2, 2, 0.2, 8]} />
        <meshLambertMaterial color="#3b82f6" transparent opacity={0.8} />
      </mesh>

      {/* Stone border */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[2.2, 2.2, 0.2, 8]} />
        <meshLambertMaterial color="#6b7280" />
      </mesh>
    </group>
  )
}
