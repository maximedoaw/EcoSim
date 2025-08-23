"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

interface Animal {
  id: string
  type: "deer" | "squirrel" | "bear"
  position: [number, number, number]
  direction: number
  speed: number
}

export function Animals() {
  const groupRef = useRef<THREE.Group>(null)

  const animals = useMemo<Animal[]>(() => {
    const animalList: Animal[] = []

    for (let i = 0; i < 20; i++) {
      const types: Animal["type"][] = ["deer", "squirrel", "bear"]
      const type = types[Math.floor(Math.random() * types.length)]

      animalList.push({
        id: `animal-${i}`,
        type,
        position: [
          (Math.random() - 0.5) * 80, // Spread across larger terrain
          0.5,
          (Math.random() - 0.5) * 80,
        ],
        direction: Math.random() * Math.PI * 2,
        speed: type === "squirrel" ? 0.02 : type === "deer" ? 0.01 : 0.005,
      })
    }

    return animalList
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return

    groupRef.current.children.forEach((child, index) => {
      const animal = animals[index]
      if (!animal) return

      // Simple wandering behavior
      animal.direction += (Math.random() - 0.5) * 0.1
      animal.position[0] += Math.cos(animal.direction) * animal.speed
      animal.position[2] += Math.sin(animal.direction) * animal.speed

      // Keep animals within bounds
      if (Math.abs(animal.position[0]) > 40) animal.direction += Math.PI
      if (Math.abs(animal.position[2]) > 40) animal.direction += Math.PI

      child.position.set(...animal.position)
      child.rotation.y = animal.direction
    })
  })

  const createAnimalGeometry = (type: Animal["type"]) => {
    switch (type) {
      case "deer":
        return (
          <group>
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[0.8, 0.6, 1.2]} />
              <meshLambertMaterial color="#8B4513" />
            </mesh>
            <mesh position={[0, 0.9, 0.4]} castShadow>
              <boxGeometry args={[0.4, 0.4, 0.4]} />
              <meshLambertMaterial color="#8B4513" />
            </mesh>
            {/* Antlers */}
            <mesh position={[-0.1, 1.2, 0.4]} castShadow>
              <boxGeometry args={[0.05, 0.3, 0.05]} />
              <meshLambertMaterial color="#654321" />
            </mesh>
            <mesh position={[0.1, 1.2, 0.4]} castShadow>
              <boxGeometry args={[0.05, 0.3, 0.05]} />
              <meshLambertMaterial color="#654321" />
            </mesh>
          </group>
        )
      case "squirrel":
        return (
          <group>
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[0.3, 0.3, 0.4]} />
              <meshLambertMaterial color="#8B4513" />
            </mesh>
            <mesh position={[0, 0.3, 0.15]} castShadow>
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshLambertMaterial color="#8B4513" />
            </mesh>
            {/* Tail */}
            <mesh position={[0, 0.4, -0.3]} castShadow>
              <boxGeometry args={[0.1, 0.1, 0.4]} />
              <meshLambertMaterial color="#654321" />
            </mesh>
          </group>
        )
      case "bear":
        return (
          <group>
            <mesh position={[0, 0.8, 0]} castShadow>
              <boxGeometry args={[1.2, 1.0, 1.6]} />
              <meshLambertMaterial color="#2F1B14" />
            </mesh>
            <mesh position={[0, 1.3, 0.6]} castShadow>
              <boxGeometry args={[0.6, 0.6, 0.6]} />
              <meshLambertMaterial color="#2F1B14" />
            </mesh>
            {/* Ears */}
            <mesh position={[-0.2, 1.5, 0.6]} castShadow>
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshLambertMaterial color="#2F1B14" />
            </mesh>
            <mesh position={[0.2, 1.5, 0.6]} castShadow>
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshLambertMaterial color="#2F1B14" />
            </mesh>
          </group>
        )
    }
  }

  return (
    <group ref={groupRef}>
      {animals.map((animal) => (
        <group key={animal.id} position={animal.position}>
          {createAnimalGeometry(animal.type)}
        </group>
      ))}
    </group>
  )
}
